import { Component } from '@angular/core';
import { DataTableComponent } from './components/data-table/data-table.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { FilterDataComponent } from './components/filter-data/filter-data.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DataTableComponent, PieChartComponent, LineChartComponent, FilterDataComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
