import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FacadeService } from '../../facade.service';
import { CommonModule } from '@angular/common';
import { EquipmentDataPipe } from '../../pipes/equipment-data.pipe';
import { FilterDataComponent } from '../filter-data/filter-data.component';


@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, EquipmentDataPipe, FilterDataComponent],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent implements OnInit, AfterContentChecked  {

  public filter: any = [];

  constructor(public facade: FacadeService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.facade.load();
  }

  equipmentDatails(quipmentSumtHours: any) {
    this.facade.createPieChartEquipmentData(quipmentSumtHours)
  }

  filterDateSelected(datesFilter: any) {
     this.filter = {...datesFilter}
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

}
