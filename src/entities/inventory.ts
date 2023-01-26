export interface IInventory {
    chemicalName: string;
    companyName: string;
    amount: string;
    units: string;
    cost: string;
    costUnit: string;
};

export enum Units {
    LBS = 'lbs',
    OZ = 'oz',
    GAL = 'gallon(s)',
    FLOZ = 'fl. oz'
}

export enum InventoryProperty {
    CHEMICAL_NAME = 'chemicalName',
    COMPANY_NAME = 'companyName',
    AMOUNT = 'amount',
    UNITS = 'units',
    COST = 'cost',
    COST_UNIT = 'costUnit'
}