export interface EquipmentModel {
  id: string;
  name: string;
  hourlyEarnings: HourlyEarning[];
}

export interface HourlyEarning {
  equipmentStateId: string;
  value: number;
}
