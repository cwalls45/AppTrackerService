import { Request, Response } from 'express';
import axios from 'axios';
import { EPAEndpoint, IChemicalCompanySummary } from '../../entities/chemical';


const getCompaniesByProductName = async (req: Request, res: Response) => {
    try {
        const productName = req.params.productName
        const response = await axios.get(`${EPAEndpoint.EPA_PRODUCT_NAME}/${productName}`);
        const productListSummary: IChemicalCompanySummary[] = response.data.items.map((product: any) => (
            {
                epaRegistrationNumber: product.eparegno,
                productName: product.productname,
                companyName: product.companyinfo[0].name,
                activeIngredients: product.active_ingredients,
                formulations: product.formulations,
            }
        ));
        res.send({ chemicalData: productListSummary });
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: `There was an error fetching company by product name: ${req.params.chemical}` });
    }
};

export default getCompaniesByProductName;