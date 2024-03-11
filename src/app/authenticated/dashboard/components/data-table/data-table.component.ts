import { Component, OnInit} from '@angular/core';
import { FacadeService } from '../../facade.service';
import { CommonModule } from '@angular/common';
import { EquipmentDataPipe } from '../../pipes/equipment-data.pipe';
import { FilterDataComponent } from '../filter-data/filter-data.component';
import { EquipmentData } from '../../../../models/equipment-data';


@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, EquipmentDataPipe, FilterDataComponent],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent implements OnInit  {

  public filter: any = [];

  constructor(public facade: FacadeService) { }

  ngOnInit(): void {

    this.filter.startDate = new Date('Wed Feb 25 2024 00:00:00 GMT-0300 (Horário Padrão de Brasília)');
    this.filter.endDate = new Date('Wed Feb 25 2024 00:00:00 GMT-0300 (Horário Padrão de Brasília)');

    this.facade.load();
  }

  equipmentDatails(equipment: EquipmentData) {
    this.facade.createPieChartEquipmentData(equipment);
    this.facade.createPositonMapEquipmentData(equipment.equipmentsPositionHistory);
  }

  filterDateSelected(datesFilter: any) {
     this.filter = {...datesFilter}
  }

}
