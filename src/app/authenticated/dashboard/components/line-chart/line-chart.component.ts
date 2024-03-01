import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';

import { EquipmentsState } from '../../../../services/states/equipments.state';
import { chartEquipmentData } from '../../../../models/chart-equipment-data';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
  providers: [provideEcharts()],
})
export class LineChartComponent implements OnInit {

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

    const seriesData = this.chartEquipmentData.map(item => ({
      data: item.earnings.gainEquipmentByState
    }));

    this.options = {
      title: {
        left: '50%',
        text: 'Ganho por equipamento',
        subtext: 'Por data',
        textAlign: 'center',
        fontWeight: 'normal',
        color: '#00aecd',
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{a} <br/>dia: {b} - {c} Reais',
      },
      xAxis: {
        type: 'category',
        data: this.chartEquipmentData.map((item) => item.title),
        splitLine: {
          show: true,
        },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: true,
        },
      },
      series: [
        {
          name: 'Ganho',
          data: seriesData[0]?.data || [],
          type: 'line',
          showSymbol: true,
          symbol: 'circle',
          symbolSize: 6,

          itemStyle: {
            color: 'red',
          },
          lineStyle: {
            color: 'green',
            width: 2,
            type: 'solid',
          },
        },
      ],
    };
  }
}
