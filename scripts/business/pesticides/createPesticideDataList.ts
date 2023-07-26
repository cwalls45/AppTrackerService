import fs from 'fs/promises';
import { IPlaybooksChemicalsList } from '../playbooks/sortChemicalsIntoFertAndPesticide';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { IActiveIngredient, IChemicalCompanyInformation, IPesticideInformation } from '../../../src/entities/chemical';

const onlyContainsNumbersOrHyphens = /^[\d-]+$/;

function main() {
    return createPesticideList().then((pesticides) => pesticides);
}

async function createPesticideList() {
    const erroredEPANumbers: string[] = []
    const unParsedPesticides = await fs.readFile('./scripts/business/playbooks/lists/pesticidesFromPlaybooks.json');
    const parsedPesticideList: IPlaybooksChemicalsList[] = JSON.parse(unParsedPesticides.toString());
    const epaNumbers = getEPANumber(parsedPesticideList);

    const epaPromises = epaNumbers.map(async (epaNumber) => {
        try {
            const mainResult = await axios.get(`https://ordspub.epa.gov/ords/pesticides/ppls/${epaNumber}`);
            const supplementalResult = await axios.get(`https://ordspub.epa.gov/ords/pesticides/apprilapi/?q=%7b%22reg_num%22:%22${epaNumber}%22%7d`);
            if (isEmpty(mainResult.data.items)) {
                throw new Error('Could not find pesticide');
            };

            const formulations: string[] = mainResult.data.items[0].formulations
                .map((formulation: { formulation: string }) => formulation.formulation)

            const activeIngredients: IActiveIngredient[] = mainResult.data.items[0].active_ingredients
                .map((activeIngredient: IActiveIngredient) => activeIngredient);

            const alternateBrandNames: string[] = mainResult.data.items[0].altbrandnames
                .map((alternateBrand: { altbrandname: string }) => alternateBrand.altbrandname)

            const approvedSites: string[] = mainResult.data.items[0].sites
                .map((site: { site: string }) => site.site);

            const approvedPests: string[] = mainResult.data.items[0].pests
                .map((pest: { pest: string }) => pest.pest);

            const companyInformation: IChemicalCompanyInformation = {
                companyName: mainResult.data.items[0].companyinfo.name || supplementalResult.data.items[0].company_name,
                companyNumber: supplementalResult.data.items[0].company_num || ''
            }

            const pesticideInfo: IPesticideInformation = {
                epaRegistrationNumber: supplementalResult.data.items[0].reg_num,
                productName: supplementalResult.data.items[0].product_name,
                productStatus: mainResult.data.items[0].product_status,
                signalWord: mainResult.data.items[0].signal_word,
                formulations,
                activeIngredients,
                alternateBrandNames,
                approvedSites,
                approvedPests,
                companyInformation
            };

            // return [mainResult.data.items[0], supplementalResult.data.items[0]];
            return pesticideInfo;
        } catch (error) {
            console.log('ERROR making query: ', error);
            erroredEPANumbers.push(epaNumber);
        }
    });

    const pesticides = (await Promise.all(epaPromises)).filter(pesticide => !isEmpty(pesticide));

    fs.appendFile('./scripts/business/pesticides/erroredPesticides.json', JSON.stringify(erroredEPANumbers));
    fs.appendFile('./scripts/business/pesticides/pesticideList.json', JSON.stringify(pesticides));

    return pesticides;
}

function getEPANumber(list: IPlaybooksChemicalsList[]): string[] {
    const itemsWithEPANumber = list.filter(item => {
        const epaNumber = getSubstring(item.Text, '(', ')').trim();
        return onlyContainsNumbersOrHyphens.test(epaNumber) && epaNumber.length > 2
    });
    return [...new Set(itemsWithEPANumber.map(item => getSubstring(item.Text, '(', ')').trim()))];
}

function getSubstring(string: string, char1: string, char2: string) {
    return string.slice(
        string.indexOf(char1) + 1,
        string.lastIndexOf(char2),
    );
}

main().then((result) => console.log('Result: ', JSON.stringify(result, null, 2))).catch((err) => {
    console.log('ERROR: ', err);
});