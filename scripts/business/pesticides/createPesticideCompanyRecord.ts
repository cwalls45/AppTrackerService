import fs from 'fs/promises';
import { IPesticideInformation } from '../../../src/entities/chemical';
import axios from 'axios';

async function main() {
    const unParsedPesticides = await fs.readFile('./scripts/business/pesticides/data/pesticideList.json');
    const parsedPesticideList: IPesticideInformation[] = JSON.parse(unParsedPesticides.toString());

    const companyList = parsedPesticideList.map(pesticide => pesticide.companyInformation.companyName).sort();
    const finalCompanyList = Array.from(new Set([...companyList]));
    await axios.post('https://9ecvyrryv5.execute-api.us-east-1.amazonaws.com/registeredPesticides/addCompanies', {
        companies: finalCompanyList
    })
}

main()
    .then(() => console.log('Completed'))
    .catch((err) => console.log('ERROR: ', err));