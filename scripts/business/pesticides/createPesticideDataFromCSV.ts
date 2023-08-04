import fs from 'fs';
import csvParser from 'csv-parser';
import { CsvPesticideData } from '../../../src/entities/chemical';

// './scripts/business/playbooks/apprildatadump_public.csv'

const approvedSiteWords = ['Turf']; //Ornamental Plants

async function main() {

    fs.createReadStream('./scripts/business/playbooks/testCSV.csv')
        .pipe(csvParser())
        .on("data", (data) => {

            if (data.SITES.includes('Turf')) {

                const csvPesticideData: CsvPesticideData = {
                    epaRegistrationNumber: data.REG_NUM,
                    productName: data.PRODUCT_NAME,
                    companyNumber: data.COMPANY_NUM,
                    companyName: data.COMPANY_NAME,
                    productStatus: data.STATUS,
                    signalWord: data.SIGNAL_WORD,
                    approvedSites: data.SITES,
                    approvedPests: data.PESTS
                };
                console.log('csvPesticideData:', csvPesticideData)
            }


        })
        .on("end", () => {
            console.log('Parse Complete');
        });
};

main()
    .catch(error => console.log('ERROR: ', error));