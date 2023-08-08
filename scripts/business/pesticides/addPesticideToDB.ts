import fs from 'fs/promises';
import axios from 'axios';
import { IPesticideInformation } from '../../../src/entities/chemical';

let recordsAdded = 0;
let pesticideLength: number;

async function main() {
    const unParsedPesticides = await fs.readFile('./scripts/business/pesticides/data/pesticideList.json');
    const parsedPesticideList: IPesticideInformation[] = JSON.parse(unParsedPesticides.toString());
    pesticideLength = parsedPesticideList.length;
    return await addPesticidesToDB(parsedPesticideList)
}

async function addPesticidesToDB(pesticideList: IPesticideInformation[]) {
    for (const pesticide of pesticideList) {
        try {

            const response = await axios.post('https://9ecvyrryv5.execute-api.us-east-1.amazonaws.com/registeredPesticides/createPesticide/file', {
                pesticide
            });
            recordsAdded++;
            console.log(`${recordsAdded}/${pesticideLength}`);
        } catch (error) {
            console.log('ERROR: ', JSON.stringify(error, null, 2));
            await fs.appendFile('./scripts/business/pesticides/data/addPesticideToDbError.json', JSON.stringify(pesticideList, null, 1));
        }

        await delay(100);
    }
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
    .then(() => console.log('Completed'))
    .catch((err) => console.log('ERROR: ', err));