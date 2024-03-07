import { Component } from '@angular/core';

import { DataTableComponent } from './components/data-table/data-table.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { MapEquipmentComponent } from './components/map-equipment/map-equipment.component';
import { DetailsHeaderComponent } from './components/details-header/details-header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DataTableComponent, PieChartComponent, LineChartComponent, MapEquipmentComponent, DetailsHeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
