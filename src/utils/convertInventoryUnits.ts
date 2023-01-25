import { IInventory, Units } from "../entities/inventory";

export const convertInventoryUnits = (inventory: IInventory): IInventory => {
    const { units, amount } = inventory;
    if (units === Units.GAL) {
        const galToFlOz = Number(amount) * 128;
        return {
            ...inventory,
            amount: galToFlOz.toString(),
            units: Units.FLOZ
        }
    } else if (units === Units.LBS) {
        const lbsToOz = Number(amount) * 16;
        return {
            ...inventory,
            amount: lbsToOz.toString(),
            units: Units.OZ
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