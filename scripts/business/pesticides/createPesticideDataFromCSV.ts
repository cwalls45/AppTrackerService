import fs from 'fs';
import csvParser from 'csv-parser';

// './scripts/business/playbooks/apprildatadump_public.csv'

async function main() {

    fs.createReadStream('./scripts/business/playbooks/testCSV.csv')
        .pipe(csvParser())
        .on("data", (data) => {

            console.log('Data:', data)

        })
        .on("end", () => {
            console.log('Parse Complete');
        });
};

main()
    .catch(error => console.log('ERROR: ', error));