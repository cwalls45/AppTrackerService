import { IChemicalApplicationForm } from "../entities/chemicalApplication";
import { IApplication } from "../entities/application";

export const formatChemicalApplicationToApplicationEvent = (chemApp: IChemicalApplicationForm): IApplication => {

    if (!chemApp.id) {
        throw new Error(`ERROR: There must be an id on ${JSON.stringify(chemApp, null, 2)}`);
    }

    const applicationDate = new Date(chemApp.dateOfApplication);
    return {
        event_id: chemApp.id,
        title: combineAreaOfApplication(chemApp.areaOfApplication),
        start: applicationDate,
        end: applicationDate,
    }
};

export const combineAreaOfApplication = (areas: string[]) => {
    return areas.join(', ');
}