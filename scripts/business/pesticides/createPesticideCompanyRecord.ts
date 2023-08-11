import fs from 'fs/promises';
import { IChemicalCompanyRecordSummary, IPesticideInformation } from '../../../src/entities/chemical';
import axios from 'axios';
import _ from 'lodash';

async function main() {
    const unParsedPesticides = await fs.readFile('./scripts/business/pesticides/data/pesticideList.json');
    const parsedPesticideList: IPesticideInformation[] = JSON.parse(unParsedPesticides.toString());

    const companyList: IChemicalCompanyRecordSummary[] = parsedPesticideList
        .map(pesticide => ({
            companyName: pesticide.companyInformation.companyName,
            companyNumber: pesticide.companyInformation.companyNumber
        })).sort((first, second) => (first.companyName > second.companyName) ? 1 : (first.companyName < second.companyName) ? -1 : 0);
    const finalCompanyList = _.uniqBy(companyList, 'companyName');
    await axios.post('https://9ecvyrryv5.execute-api.us-east-1.amazonaws.com/registeredPesticides/addCompanies', {
        companies: finalCompanyList
    })
    console.log('finalCompanyList', JSON.stringify(finalCompanyList, null, 1))
    console.log('finalCompanyList.length', finalCompanyList.length)
}

main()
    .then(() => console.log('Completed'))
    .catch((err) => console.log('ERROR: ', err));