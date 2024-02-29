import { Pipe, PipeTransform } from '@angular/core';
import { MachineMonitor } from '../../../models/machine-monitor';
import { EquipmentData } from '../../../models/equipment-data';

@Pipe({
  name: 'equipmentData',
  standalone: true,

})
export class EquipmentDataPipe implements PipeTransform {

  transform(equipments: MachineMonitor[] | null | undefined, filter: any): EquipmentData[] {

    if (!equipments) {
      return [];
    }
    //debugger
    //const startDate = new Date('Wed Feb 25 2021 00:00:00 GMT-0300 (Horário Padrão de Brasília)');
    //const endDate = new Date('Wed Feb 25 2021 00:00:00 GMT-0300 (Horário Padrão de Brasília)');
    const startDate = new Date(filter.startDate);

    const endDate = new Date(filter.endDate);
    endDate.setUTCHours(23, 59, 59, 999);

    // Convertendo as datas para UTC
    const startDateUTC = new Date(startDate).getTime();
    const endDateUTC = new Date(endDate).getTime();

    let equipmentData: EquipmentData[] = [];

    equipments.forEach((equipment) => {

      console.log(equipment.id, '-init')

      let firstOrLastState = false;

      let equipmentSumtHours = { operando: 0, manutencao: 0, parado: 0 };

      let nextStateDateUTC = 0;

      equipment.equipmentsStatesHistory.states.forEach((state, index, statesArray) => {

        // Acessa o próximo estado se ele existir de ative o calculo para o primeiro estado
        if (index < statesArray.length - 1 && nextStateDateUTC == 0) {
          const nextDate = new Date(statesArray[index + 1].date).getTime();
          if (nextDate >= startDateUTC) {
            firstOrLastState = true;
          }
        }

        let currentStateDateUTC = new Date(state.date).getTime();

        //Pare se data não corresponde ao filtro ou não for o primeiro ou ultimo estado para calculo
        if (!((currentStateDateUTC >= startDateUTC && currentStateDateUTC <= endDateUTC) || firstOrLastState)) return;

        // Cria uma data nova com a proxima data, porém com 00:00:00 horas, para o calculo do primeiro status.
        if (nextStateDateUTC === 0) {
          let nextStateDate = new Date(statesArray[index + 1].date);
          currentStateDateUTC = nextStateDate.getTime();
          let newStartState = new Date(statesArray[index + 1].date);
          newStartState.setUTCHours(0, 0, 0, 0);
          nextStateDateUTC = newStartState.getTime();
          firstOrLastState = false;
        }

        const nextDate = new Date(statesArray[index + 1].date).getTime();
        //Cria uma data nova com a data atual, porém com o ultipo periodo do dia 23:59:59
        if (endDateUTC < nextDate) {
          let endStateDate = new Date(state.date);
          endStateDate.setUTCHours(23, 59, 59, 999);
          nextStateDateUTC = endStateDate.getTime();
        }

        //Calcular a diferença em milissegundos
        const diffMs = Math.abs(nextStateDateUTC - currentStateDateUTC);
        //Converter a diferença de milissegundos para horas
        const currentStatusSumtHours = diffMs / (1000 * 60 * 60);

        let equipmentStateCurrentDate = equipment.stateData.find(data => data.id === state.equipmentStateId)?.name;

        switch (equipmentStateCurrentDate) {
          case equipment.stateData[0].name:
            equipmentSumtHours.operando += Math.ceil(currentStatusSumtHours)
            break;
          case equipment.stateData[1].name:
            equipmentSumtHours.parado += Math.ceil(currentStatusSumtHours)
            break;
          case equipment.stateData[2].name:
            equipmentSumtHours.manutencao += Math.ceil(currentStatusSumtHours)
            break;
        }

        nextStateDateUTC = new Date(statesArray[index + 2].date).getTime();

      })

      const gainEquipement = this.calculateGainEquipment(equipment, equipmentSumtHours);

      console.log(
        equipment.id, '---',
        equipmentSumtHours.operando + 'operando', '-', equipmentSumtHours.manutencao + 'manutencao', '-', equipmentSumtHours.parado + 'parado', '-',
        equipmentSumtHours.operando + equipmentSumtHours.manutencao + equipmentSumtHours.parado, '---', gainEquipement
      )

      let _equipmentData: EquipmentData = {
        ...equipment,
        equipmentSumtHours: { ...equipmentSumtHours },
        gainEquipement: gainEquipement
      }

      equipmentData.push(_equipmentData);
    })

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

}
