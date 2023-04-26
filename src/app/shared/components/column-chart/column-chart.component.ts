import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { CommonModule } from '@angular/common';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels, ApexFill,
  ApexPlotOptions,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis, ApexYAxis, NgApexchartsModule
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};
@Component({
  selector: 'app-column-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.scss']
})
export class ColumnChartComponent implements OnChanges{

  @Input() series: any;
  @Input() labels: any;
  @Input() title: string;
  @Input() color: any;

  public chartOptions: Partial<ChartOptions> | any;
  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.chartOptions = {
        series: [
          {
            name: `Average precipitation`,
            data: this.series,
            color: this.color || '#312015'
          }
        ],
        chart: {
          height: 350,
          type: "bar"
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: "top",
              columnWidth: "50%",
              endingShape: "rounded"// top, center, bottom
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function(val) {
            return val;
          },
          offsetY: -20,
          style: {
            fontSize: "12px",
            colors: ["#304758"]
          }
        },

        xaxis: {
          categories:this.labels,

          position: "bottom",
          labels: {
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          crosshairs: {
            fill: {
              type: "gradient",
              gradient: {
                colorFrom: "#D8E3F0",
                colorTo: "#7fabd9",
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5
              }
            }
          },
          tooltip: {
            enabled: true,
            offsetY: -35
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [50, 0, 100, 100]
          }
        },
        yaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          labels: {
            show: false,
            formatter: function(val) {
              return val;
            }
          }
        },
        title: {
          text: this.title,
          floating: 0,
          align: "center",
          position:'top',
          style: {
            color: "#444"
          }
        }
      };
    }
  }
}

