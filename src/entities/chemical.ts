//REFERENCE: https://www.epa.gov/pesticide-labels/pesticide-product-label-system-ppls-application-program-interface-api#api

export enum EPAEndpoint {
    EPA_PARTIAL_PRODUCT_NAME = 'https://ordspub.epa.gov/ords/pesticides/cswu/ProductSearch/partialprodsearch/v2/riname',
    EPA_PRODUCT_NAME = 'https://ordspub.epa.gov/ords/pesticides/pplstxt'
};

export interface IEPAPartialProductName {
    eparegno: string;
    productname: string;
    product_name_status: string;
    product_status: string;
    product_status_date: string;
    altrntbrndnames: string | null;
}

export interface IProductSummary {
    epaRegistrationNumber: string;
    productName: string;
    productStatus: string;
};

export interface IChemicalCompanySummary {
    epaRegistrationNumber: string;
    productName: string;
    companyName: string;
    activeIngredients: IActiveIngredient[];
    formulations: { formulation: string }[];
};

export interface IActiveIngredient {
    pc_Code: string;
    activeIngredient: string;
    activeIngredientPercent: number;
    cas_Number: string;
}
