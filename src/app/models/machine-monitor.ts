import { EquipmentModel } from "./equipment-model";
import { EquipmentPositionHistory } from "./equipment-position-history";
import { EquipmentState } from "./equipment-state";
import { EquipmentStateHistory } from "./equipment-state-history";

export interface MachineMonitor {
    id: string;
    equipmentModelId: string;
    name: string;
    equipmentsModels: EquipmentModel;
    equipmentsPositionHistory: EquipmentPositionHistory[];
    equipmentsStatesHistory: EquipmentStateHistory;
    stateData: EquipmentState[]
}
