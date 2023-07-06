import fs from 'fs/promises';
import { IPlaybooksChemicalsList } from '../playbooks/sortChemicalsIntoFertAndPesticide';
import axios from 'axios';

const onlyContainsNumbersOrHyphens = /^[\d-]+$/;

function main() {
    return createPesticideList().then((pesticides) => pesticides);
}

async function createPesticideList() {
    const unParsedPesticides = await fs.readFile('./scripts/business/playbooks/lists/pesticidesFromPlaybooks.json');
    const parsedPesticideList: IPlaybooksChemicalsList[] = JSON.parse(unParsedPesticides.toString());
    const epaNumbers = getEPANumber(parsedPesticideList);
    const epaPromises = epaNumbers.map(async (epaNumber) => {
        return await createPromises(epaNumber);
    });
    const pesticides = await Promise.all([epaPromises[0], epaPromises[1]]);
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

function createEPAQueryUrl(epaNumber: string) {
    return `https://ordspub.epa.gov/ords/pesticides/ppls/${epaNumber}`
};

async function createPromises(epaNumber: string) {
    const queryString = createEPAQueryUrl(epaNumber);
    return await axios.get(queryString);
};

main().then((result) => console.log('Result: ', result)).catch((err) => {
    console.log('ERROR: ', err);
});