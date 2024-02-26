import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import type { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
  providers: [provideEcharts()],
})
export class LineChartComponent implements OnInit {
  options!: any;
  private data!: any;

  ngOnInit(): void {
    this.data = [
      { name: '01/02/2021', value: 500, color: '#ccffcc' },
      { name: '02/02/2021', value: 300, color: '#aaffcc' },
      { name: '03/02/2021', value: 900, color: '#ccffaa' },
      { name: '04/02/2021', value: 500, color: '#ccffcc' },
      { name: '05/02/2021', value: 300, color: '#aaffcc' },
      { name: '06/02/2021', value: 900, color: '#ccffaa' },
      { name: '01/02/2021', value: 500, color: '#ccffcc' },
      { name: '02/02/2021', value: 300, color: '#aaffcc' },
      { name: '03/02/2021', value: 900, color: '#ccffaa' },
      { name: '04/02/2021', value: 500, color: '#ccffcc' },
      { name: '05/02/2021', value: 300, color: '#aaffcc' },
      { name: '06/02/2021', value: 900, color: '#ccffaa' },
    ];

    // initialize chart options:
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
        data: this.data.map((item: any) => item.name),
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
          data: this.data.map((item: any) => item.value),
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
