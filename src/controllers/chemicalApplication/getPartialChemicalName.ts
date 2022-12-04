import { Request, Response } from 'express';
import axios from 'axios';
import { EPAEndpoint, IEPAPartialProductName, IProductSummary } from '../../entities/chemical';


const getByPartialChemicalName = async (req: Request, res: Response) => {
    try {
        const chemical = req.params.chemical
        const response = await axios.get(`${EPAEndpoint.EPA_PARTIAL_PRODUCT_NAME}/${chemical}`);
        const chemicalList = response.data.items as IEPAPartialProductName[];
        const formattedChemicalList: IProductSummary[] =
            chemicalList
                .map((chemical) => ({
                    epaRegistrationNumber: chemical.eparegno,
                    productName: chemical.productname,
                    productStatus: chemical.product_status
                }));
        console.log(chemicalList)
        res.send({ chemicals: formattedChemicalList });
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: `There was an error fetching chemical by partial chemical name: ${req.params.chemical}` });
    }
};

export default getByPartialChemicalName;