import { Component, OnInit } from '@angular/core';
import { EquipmentsState } from '../../../../services/states/equipments.state';
import { chartEquipmentData } from '../../../../models/chart-equipment-data';

@Component({
  selector: 'app-details-header',
  standalone: true,
  imports: [],
  templateUrl: './details-header.component.html',
  styleUrl: './details-header.component.scss'
})
export class DetailsHeaderComponent implements OnInit {

  public chartEquipmentData: chartEquipmentData[] = [];

  constructor(private state: EquipmentsState) { }

  ngOnInit(): void {
    this.state.chartEquipmentData$.subscribe((result) => {
      this.chartEquipmentData = result;
    });
  }
}
