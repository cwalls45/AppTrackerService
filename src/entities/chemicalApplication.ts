export interface IChemicalApplicationForm {
    id?: string;
    dateOfApplication: string;
    areaOfApplication: string[];
    totalAreaOfApp: string;
    totalAreaOfAppUnit: string;
    targetPests: string[];
    chemicals: IChemical[];
};

export interface IChemical {
    chemicalCompany: string;
    chemicalName: string;
    amount: string;
    units: string
};

export enum ChemicalApplicationFormProperty {
    ID = 'id',
    DATE_OF_APPLICATION = 'dateOfApplication',
    AREA_OF_APPLICATION = 'areaOfApplication',
    TOTAL_AREA_OF_APP = 'totalAreaOfApp',
    TOTAL_AREA_OF_APP_UNIT = 'totalAreaOfAppUnit',
    TARGET_PESTS = 'targetPests',
    CHEMICALS = 'chemicals'
};

export enum ChemicalProperties {
    CHEMICAL_COMPANY = 'chemicalCompany',
    CHEMICAL_NAME = 'chemicalName',
    AMOUNT = 'amount',
    UNITS = 'units'
};