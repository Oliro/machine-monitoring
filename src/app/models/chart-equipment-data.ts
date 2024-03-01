import { GainEquipment } from "./equipment-data";

export interface chartEquipmentData {
    title: string;
    productivity: ProductivityEquipment;
    earnings: GainEquipment;
}

export interface ProductivityEquipment {
    title: string;
    value: number;
    color: string;
}