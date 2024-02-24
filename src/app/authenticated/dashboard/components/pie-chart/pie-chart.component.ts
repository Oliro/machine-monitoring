import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import { EquipmentsState } from '../../../../services/states/equipments.state';
import { PieChartEquipmentData } from '../../../../models/pie-chart-equipment-data';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
  providers: [
    provideEcharts(),
  ]
})
export class PieChartComponent implements OnInit {

  public pieChartEquipmentData: PieChartEquipmentData[] = [];

  public options: any = {}

  constructor(private state: EquipmentsState) { }

  ngOnInit(): void {
    this.state.pieChartEquipmentData$.subscribe((result) => {
      this.pieChartEquipmentData = result;
      this.chartOptions();
    });
  }

  chartOptions() {
    this.options = {
      title: {
        left: '50%',
        text: 'Percentual de Produtividade',
        subtext: 'Por data',
        textAlign: 'center',
        fontWeight: 'normal',
        color: '#00aecd',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        align: 'auto',
        bottom: 10,
        data: this.pieChartEquipmentData.map((item) => item.title),
      },
      calculable: true,
      series: [
        {
          name: 'Estado',
          type: 'pie',
          radius: [0, 110],
          data: this.pieChartEquipmentData.map((item) => ({
            value: item.value,
            itemStyle: { color: item.color },
            name: item.title,
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }

}
