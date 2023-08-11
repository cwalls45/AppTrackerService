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
    //TODO: remove optional flag
};

export interface IActiveIngredient {
    pc_Code: string;
    active_ing: string;
    active_ing_percent: number;
    cas_Number: string;
};

export interface IActiveIngredientSummary {
    active_ing: string;
    active_ing_percent: number;
};

export interface IPesticideInformation {
    epaRegistrationNumber: string;
    productName: string;
    productStatus: string;
    signalWord: string;
    formulations: string[];
    activeIngredients: IActiveIngredient[];
    alternateBrandNames: string[];
    inactiveBrandNames: string[];
    pdfFiles: IPesticidePdf[];
    approvedSites: string[];
    approvedPests: string[];
    companyInformation: IChemicalCompanyInformation;
    pesticideTypes: string[];
};

export interface IRegisteredPesticideSummary {
    epaRegistrationNumber: string;
    productName: string;
    productStatus: string;
    signalWord: string;
    formulations: string[];
    activeIngredients: IActiveIngredientSummary[];
    companyName: string;
}

export interface IPesticidePdf {
    epaRegistrationNumber: string;
    pdfFile: string;
    pdfFileAcceptedDate: string;
}

export interface CsvPesticideData {
    epaRegistrationNumber: string;
    productName: string;
    companyNumber: string;
    companyName: string;
    productStatus: string;
    signalWord: string;
    approvedSites: string;
    approvedPests: string;
};

export interface IChemicalCompanyInformation {
    companyName: string;
    contactPerson: string;
    phoneNumber: string;
    email: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    companyNumber: string;
}

export interface IChemicalCompanyRecordSummary {
    companyName: string;
    companyNumber: string;
}
