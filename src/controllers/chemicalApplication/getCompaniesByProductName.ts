import { Request, Response } from 'express';
import axios from 'axios';
import { EPAEndpoint, IEPAPartialProductName, IProductSummary } from '../../entities/chemical';


const getCompaniesByProductName = async (req: Request, res: Response) => {
    try {
        const productName = req.params.productName
        const response = await axios.get(`${EPAEndpoint.EPA_PRODUCT_NAME}/${productName}`);
        const chemicalList = response.data.items as IEPAPartialProductName[];
        // console.log(chemicalList)
        // const activeChemicalList: IProductSummary[] =
        //     chemicalList
        //         .map((chemical) => ({
        //             epaRegistrationNumber: chemical.eparegno,
        //             productName: chemical.productname,
        //             productStatus: chemical.product_status
        //         }));
        res.send({ chemicalData: chemicalList });
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: `There was an error fetching company by product name: ${req.params.chemical}` });
    }
};

export default getCompaniesByProductName;