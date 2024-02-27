import { Pipe, PipeTransform } from '@angular/core';
import { MachineMonitor } from '../../../models/machine-monitor';
import { EquipmentData } from '../../../models/equipment-data';

@Pipe({
  name: 'equipmentData',
  standalone: true, 
  //pure Foi setado false 'impuro', para evitar que o objeto equipments ivertesse e alterasse a logica
  pure: false,
})
export class EquipmentDataPipe implements PipeTransform {

  transform(equipments: MachineMonitor[] | null | undefined, filter: any): EquipmentData[] {

    if (!equipments) {
      return [];
    }

    let selectedDate = '2021-02-21';
    if(filter.startDate > 0){
      selectedDate = this.filterDataByDateRange(filter).formattedStartDate
    }
    

    let equipmentData: EquipmentData[] = [];

    equipments.map((equipment) => {
  
      let previousDate: any = null;
      let getlastStatePreviousDay = 0;

      let equipmentSumtHours = { operando: 0, manutencao: 0, parado: 0 };

      equipment.equipmentsStatesHistory.states.forEach((state) => {

        const isDateSelected = state.date.startsWith(selectedDate);
        const isDatePreviousDay = state.date.startsWith(this.getPreviousDay(selectedDate));

        if (!(isDateSelected || isDatePreviousDay)) return;

        const stateData = equipment.stateData.find(data => data.id === state.equipmentStateId);

        //horas estado anterior para encontrar a diferença
        let startState = new Date(state.date).getTime();
        //horas estado atual para encontrar a diferença
        let endState = new Date(previousDate).getTime();

        if (!state.date.startsWith(selectedDate) && getlastStatePreviousDay === 0) {
          // Definir o início do dia anterior para encontrar a diferença caso a data não seja atual
          let newStartState = new Date(endState);
          newStartState.setUTCHours(0, 0, 0, 0);

          // Atualizar o estado inicial
          startState = newStartState.getTime();

          // Atualizar o sinalizador para indicar que o estado do último dia foi obtido
          getlastStatePreviousDay = 1;
        }

        if (endState == 0) {
          // Definir o final do dia como estado posterior, caso a data não seja atual
          let newEndState = new Date(startState);
          newEndState.setUTCHours(23, 59, 59, 999);

          // Obter o valor de data final em milissegundos
          endState = newEndState.getTime();
        }

        // Calcular a diferença em milissegundos
        const diffMs = Math.abs(endState - startState);
        // Converter a diferença de milissegundos para horas
        const diffHoras = diffMs / (1000 * 60 * 60);

        if (state.date.startsWith(selectedDate) || getlastStatePreviousDay === 1) {

          switch (stateData?.name) {
            case equipment.stateData[0].name:
              equipmentSumtHours.operando += Math.ceil(diffHoras)
              break;
            case equipment.stateData[1].name:
              equipmentSumtHours.parado += Math.ceil(diffHoras)
              break;
            case equipment.stateData[2].name:
              equipmentSumtHours.manutencao += Math.ceil(diffHoras)
              break;
          }

          if (getlastStatePreviousDay === 1) {
            getlastStatePreviousDay = 2;
          }

        }
        previousDate = state.date
      })

      const gainEquipement = this.calculateGainEquipment(equipment, equipmentSumtHours);

      let _equipmentData: EquipmentData = {
        ...equipment,
        equipmentSumtHours: equipmentSumtHours,
        gainEquipement: gainEquipement
      }

      equipmentData.push(_equipmentData);

    });

    //console.log(equipmentData)
    return equipmentData;
  }

  calculateGainEquipment(equipment: MachineMonitor, equipmentSumtHours: any) {

    const equipmentModelEarnings = { operando: 0, parado: 0, manutencao: 0 }

    equipment.equipmentsModels.hourlyEarnings.forEach((item) => {
      const equipmentEarning = equipment.stateData.find(state => state.id == item.equipmentStateId);
      switch (equipmentEarning?.name) {
        case 'Operando':
          equipmentModelEarnings.operando = item.value
          break;
        case 'Parado':
          equipmentModelEarnings.parado = item.value
          break;
        case 'Manutenção':
          equipmentModelEarnings.manutencao = item.value
          break;
        default:
          break;
      }
    });

    const _gainEquipement =
      (equipmentSumtHours.operando * equipmentModelEarnings.operando) +
      (equipmentSumtHours.manutencao * equipmentModelEarnings.manutencao) +
      (equipmentSumtHours.parado * equipmentModelEarnings.parado);

    return _gainEquipement;

  }

  getPreviousDay(data: string) {
    const currentDate = new Date(data);
    const oneDay = 24 * 60 * 60 * 1000; // em milissegundos
    const prevDate = new Date(currentDate.getTime() - oneDay);
    return prevDate.toISOString().split('T')[0];
  }

  filterDataByDateRange(filter: any) {
    let startDate = new Date(filter.startDate);
    let formattedStartDate = this.formatDate(startDate);

    let endDate = new Date(filter.endDate);
    let formattedEndDate = this.formatDate(endDate);

    return {formattedStartDate, formattedEndDate}
  }

  formatDate(date: Date): string {
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

}
