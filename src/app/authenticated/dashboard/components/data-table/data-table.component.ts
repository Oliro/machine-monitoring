import { Component, OnInit } from '@angular/core';
import { FacadeService } from '../../facade.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent implements OnInit {

  constructor(public facade: FacadeService) { }

  ngOnInit(): void {
    this.facade.load();
  }

  equipmentDatails(quipmentSumtHours: any) {
    this.facade.createPieChartEquipmentData(quipmentSumtHours)
  }

}
