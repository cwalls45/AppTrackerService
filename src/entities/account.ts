export interface IAccount {
    accountId: string;
    user: IUser;
    courseAreas: ICourseArea[];
}

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
}

export interface IState {
    name: string;
    abbreviation: string;
    label: string;
}

export enum TurfType {
    BENTGRASS = 'Bentgrass',
    POA_ANNUA = 'Poa Annua',
    KENTUCKY_BLUEGRASS = 'Kentucky Bluegrass',
    ROUGH_BLUEGRASS = 'Rough Bluegrass',
    TALL_FESCUE = 'Tall Fescue',
    FINE_FESCUE = 'Fine Fescue',
    PERENNIAL_RYE = 'Perennial Ryegrass',
    ANNUAL_RYE = 'Annual Ryegrass',
    BERMUDA = 'Bermuda',
    ZOYSIA = 'Zoysia',
    BAHIA = 'Bahia',
    ST_AUGUSTINE = 'St. Augustine grass',
    CENTIPEDE = 'Centipede grass',
    BUFFALOGRASS = 'Buffalograss',
    CARPETGRASS = 'Carpetgrass'
}

export enum AreaOfCourse {
    GREENS = 'Greens',
    APPROACH = 'Approach',
    FAIRWAY = 'Fairway',
    COLLARS = 'Collars',
    RUNOFFS = 'Runoff',
    INTERMEDIATE = 'Intermediate',
    ROUGH = 'Rough',
    NATIVE = 'Native',
    TEES = 'Tees'
}

export interface ICourseArea {
    area: AreaOfCourse | '';
    size: string;
    sizeUnit: 'Acres' | 'Sq. Feet' | '';
    turfType: TurfType | ''
}