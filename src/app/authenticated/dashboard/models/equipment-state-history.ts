export interface EquipmentStateHistory {
  equipmentId: string;
  states: State[];
}

export interface State {
  date: string;
  equipmentStateId: string;
}
