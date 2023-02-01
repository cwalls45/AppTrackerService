import { IInventory, Units } from "../entities/inventory";

export const convertInventoryUnits = (inventory: IInventory): IInventory => {
    const { units, amount, cost } = inventory;
    if (units === Units.GAL) {
        const galToFlOz = Number(amount) * 128;
        const galCostToFlOzCost = Number(cost) / galToFlOz;
        return {
            ...inventory,
            amount: galToFlOz.toString(),
            units: Units.FLOZ,
            cost: galCostToFlOzCost.toString(),
            costUnit: Units.FLOZ
        }
    } else if (units === Units.LBS) {
        const lbsToOz = Number(amount) * 16;
        const lbsCostToOzCost = Number(cost) / lbsToOz;
        return {
            ...inventory,
            amount: lbsToOz.toString(),
            units: Units.OZ,
            cost: lbsCostToOzCost.toString(),
            costUnit: Units.OZ
        }
    } else {
        return inventory
    }
}

export const canUnitsBeAddedTogether = (inventory: IInventory, existingInventory: IInventory): boolean => {

    if (existingInventory.units === Units.FLOZ && (inventory.units === Units.LBS || inventory.units === Units.OZ)) {
        return false;
    } else if (existingInventory.units === Units.OZ && (inventory.units === Units.GAL || inventory.units === Units.FLOZ)) {
        return false;
    }
    return true;
}

export const averageCost = (inventory: IInventory, existingInventory: IInventory): string => {
    const combinedCost = Number(inventory.cost) + Number(existingInventory.cost);
    const averagedCost = combinedCost / 2;
    return averagedCost.toString();
}