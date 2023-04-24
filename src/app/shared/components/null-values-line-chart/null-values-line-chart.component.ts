import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { CommonModule } from '@angular/common';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels, ApexFill,
  ApexMarkers,
  ApexStroke, ApexTheme, ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis, ApexYAxis, NgApexchartsModule
} from "ng-apexcharts";
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  theme: ApexTheme;
  yaxis: ApexYAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};
@Component({
  selector: 'app-null-values-line-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './null-values-line-chart.component.html',
  styleUrls: ['./null-values-line-chart.component.scss']
})
export class NullValuesLineChartComponent implements OnChanges{
  @Input() data: any;
  @Input() startDate: any;
  @Input() endDate: any;
  @Input() city: string;
  @Input() parameter: any;
  public chartOptions: Partial<ChartOptions> | any;
  ngOnChanges(changes: SimpleChanges): void {
    // const startDate = new Date(this.form.get("alarmForm")?.get("dateStart")?.value as Date).toLocaleString();
    // const endDate = new Date(this.form.get("alarmForm")?.get("dateEnd")?.value as Date).toLocaleString();
    console.log(changes);
    if (changes) {
      this.chartOptions = {
        series: [
          {
            name: this.parameter.units,
            data: this.data
          }
        ],
        chart: {
          type: "area",
          height: 350,
          animations: {
            enabled: false
          },
          zoom: {
            type: "x",
            enabled: true,
            autoScaleYaxis: true
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "straight"
        },
        fill: {
          opacity: 0.8,
          type: "pattern",
          pattern: {
            style: "horizontalLines",
            width: 5,
            height: 5,
            strokeWidth: 3
          }
        },
        markers: {
          size: 5,
          hover: {
            size: 9
          }
        },
        title: {
          text: `${this.parameter.title} During Raid Alarms in ${this.city}`
        },
        tooltip: {
          intersect: true,
          shared: false
        },
        theme: {
          palette: "palette1"
        },
        xaxis: {
          type: "datetime"
        },
        yaxis: {
          title: {
            text: this.parameter.units
          }
        }
      };
    }
  }


}
