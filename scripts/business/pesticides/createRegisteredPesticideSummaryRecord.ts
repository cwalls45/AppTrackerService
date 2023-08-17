import fs from 'fs/promises';
import { IPesticideInformation } from '../../../src/entities/chemical';
import axios from 'axios';

let numberCompleted = 0;

async function main() {
    const unParsedPesticides = await fs.readFile('./scripts/business/pesticides/data/pesticideList.json');
    const parsedPesticideList: IPesticideInformation[] = JSON.parse(unParsedPesticides.toString());
    const totalNumber = parsedPesticideList.length;

    for (const record of parsedPesticideList) {
        try {
            await axios.post('https://9ecvyrryv5.execute-api.us-east-1.amazonaws.com/registeredPesticides/registeredPesticideSummary', {
                pesticide: record
            });
            numberCompleted++;
            console.log(`${numberCompleted}/${totalNumber}`)
        } catch (error) {
            console.log('ERROR: ', error)
            await fs.appendFile('./scripts/business/pesticides/data/registeredPesticideSummaryErrors.json', JSON.stringify(record, null, 1));
            numberCompleted++;
            console.log(`${numberCompleted}/${totalNumber}`)
        }
    }
    await delay(100);
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
    .then(() => console.log('Completed'))
    .catch((err) => console.log('ERROR: ', err));