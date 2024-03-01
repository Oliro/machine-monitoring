import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';

import { EquipmentsState } from '../../../../services/states/equipments.state';
import { chartEquipmentData } from '../../../../models/chart-equipment-data';


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

  public chartEquipmentData: chartEquipmentData[] = [];

  public options: any = {}

  constructor(private state: EquipmentsState) { }

  ngOnInit(): void {
    this.state.chartEquipmentData$.subscribe((result) => {
      this.chartEquipmentData = result;
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
        formatter: '{a} do equipamento: <br/>{b} : {c} horas ({d}%)',
      },
      legend: {
        align: 'auto',
        bottom: 10,
        data: this.chartEquipmentData.map((item) => item.productivity.title),
      },
      calculable: true,
      series: [
        {
          name: 'Estado',
          type: 'pie',
          radius: [0, 110],
          data: this.chartEquipmentData.map((item) => ({
            value: item.productivity.value,
            itemStyle: { color: item.productivity.color },
            name: item.productivity.title,
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
