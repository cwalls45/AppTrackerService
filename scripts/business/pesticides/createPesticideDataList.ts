import fs from 'fs/promises';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { CsvPesticideData, IActiveIngredient, IChemicalCompanyInformation, IPesticideInformation } from '../../../src/entities/chemical';

const onlyContainsNumbersOrHyphens = /^[\d-]+$/;

async function main() {
    const unParsedPesticides = await fs.readFile('./scripts/business/playbooks/lists/csvPesticides.json');
    const parsedPesticideList: CsvPesticideData[] = JSON.parse(unParsedPesticides.toString());
    return await createPesticideList(parsedPesticideList);
}

async function createPesticideList(parsedPesticideList: CsvPesticideData[]) {
    const erroredEPANumbers: string[] = []

    for (const record of parsedPesticideList) {
        try {
            const mainResult = await axios.get(`https://ordspub.epa.gov/ords/pesticides/ppls/${record.epaRegistrationNumber}`);

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
                companyName: record.companyName,
                contactPerson: mainResult.data.items[0].companyinfo[0].contact_person,
                phoneNumber: mainResult.data.items[0].companyinfo[0].phone,
                email: mainResult.data.items[0].companyinfo[0].email,
                street: mainResult.data.items[0].companyinfo[0].street,
                city: mainResult.data.items[0].companyinfo[0].city,
                state: mainResult.data.items[0].companyinfo[0].state,
                zipCode: mainResult.data.items[0].companyinfo[0].zip_code,
                companyNumber: record.companyNumber,
            }

            const pesticideInfo: IPesticideInformation = {
                epaRegistrationNumber: record.epaRegistrationNumber,
                productName: record.productName,
                productStatus: mainResult.data.items[0].product_status,
                signalWord: mainResult.data.items[0].signal_word,
                formulations,
                activeIngredients,
                alternateBrandNames,
                approvedSites,
                approvedPests,
                companyInformation
            };

            console.log('DATA: ', mainResult.data.items[0]);
        } catch (error) {
            console.log('ERROR making query: ', error);
            erroredEPANumbers.push(record.epaRegistrationNumber);
        }

        await delay(100);
    }

    // // await fs.appendFile('./scripts/business/pesticides/erroredPesticides.json', JSON.stringify(erroredEPANumbers));
    // // await fs.appendFile('./scripts/business/pesticides/pesticideList.json', JSON.stringify(pesticides));

    // return pesticides;
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
    .then(() => console.log('Completed'))
    .catch((err) => console.log('ERROR: ', err));