import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { CommonModule } from '@angular/common';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill
} from "ng-apexcharts";
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
};
@Component({
  selector: 'app-stacked-column-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stacked-column-chart.component.html',
  styleUrls: ['./stacked-column-chart.component.scss']
})
export class StackedColumnChartComponent implements OnChanges{
  @Input() data;
  @Input() startDate;
  @Input() endDate;

  public chartOptions: Partial<ChartOptions>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.chartOptions = {
        series: [
          {
            name: "PRODUCT A",
            data: [44, 55, 41, 67, 22, 43]
          },
          {
            name: "PRODUCT B",
            data: [13, 23, 20, 8, 13, 27]
          },
          {
            name: "PRODUCT C",
            data: [11, 17, 15, 15, 21, 14]
          },
          {
            name: "PRODUCT D",
            data: [21, 7, 25, 13, 22, 8]
          }
        ],
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          toolbar: {
            show: true
          },
          zoom: {
            enabled: true
          }
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0
              }
            }
          }
        ],
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        xaxis: {
          type: "category",
          categories: [
            "01/2011",
            "02/2011",
            "03/2011",
            "04/2011",
            "05/2011",
            "06/2011"
          ]
        },
        legend: {
          position: "right",
          offsetY: 40
        },
        fill: {
          opacity: 1
        }
      };
    }
  }

}
