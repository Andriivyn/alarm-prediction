import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexTitleSubtitle,
  ApexXAxis,
  ChartComponent,
  NgApexchartsModule
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
};

@Component({
  selector: "app-radar-chart",
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: "./radar-chart.component.html",
  styleUrls: ["./radar-chart.component.scss"]
})
export class RadarChartComponent implements OnChanges {
  @Input() data: any;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;

  constructor(private changes: ChangeDetectorRef) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      console.log(changes);
      console.log(this.data);
      // this.chartOptions = {
      //   series: {
      //     name: "Radar",
      //     data: this.data.series
      //   },
      //   chart: {
      //     height: 800,
      //     type: "radar"
      //   },
      //   xaxis: {
      //     categories: this.data.labels
      //   },
      //   title: {
      //     text: `${this.data.title}`
      //   }
      // };
      this.chartOptions = {
        series: [
          {
            name: "Series 1",
            data: this.data.series
          }
        ],
        chart: {
          height: 800,
          type: "radar"
        },
        title: {
          text: "Basic Radar Chart"
        },
        xaxis: {
          categories: this.data.labels
        }
      };
    }
  }
}
