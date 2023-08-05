import fs from 'fs';
import csvParser from 'csv-parser';
import { CsvPesticideData } from '../../../src/entities/chemical';

// './scripts/business/playbooks/apprildatadump_public.csv'
// './scripts/business/playbooks/testCSV.csv'

const csvPesticideData: CsvPesticideData[] = [];
const approvedSiteWords = ['Turf']; //Ornamental Plants

async function main() {

    fs.createReadStream('./scripts/business/playbooks/apprildatadump_public.csv')
        .pipe(csvParser())
        .on("data", (data) => {

            if (data.SITES.includes('Turf') && data.COMPANY_NUM) {
                const pesticideData: CsvPesticideData = {
                    epaRegistrationNumber: data.REG_NUM,
                    productName: data.PRODUCT_NAME,
                    companyNumber: data.COMPANY_NUM,
                    companyName: data.COMPANY_NAME,
                    productStatus: data.STATUS,
                    signalWord: data.SIGNAL_WORD,
                    approvedSites: data.SITES,
                    approvedPests: data.PESTS
                };
                console.log('pesticideData:', pesticideData);
                csvPesticideData.push(pesticideData);
            }
        })
        .on("end", () => {
            fs.appendFileSync('./scripts/business/playbooks/lists/csvPesticides.json', JSON.stringify(csvPesticideData, null, 2));
            console.log('Parse Complete');
        });
};

main()
    .catch(error => console.log('ERROR: ', error));