import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import {
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexTitleSubtitle,
  ChartComponent,
  NgApexchartsModule
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
  fill: ApexFill,
  dataLabels: ApexDataLabels
  labels: any;
  colors: any;
};

@Component({
  selector: "app-pie-chart",
  templateUrl: "./pie-chart.component.html",
  styleUrls: ["./pie-chart.component.scss"],
  standalone: true,
  imports: [
    NgApexchartsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieChartComponent implements OnChanges {
  @Input() data: any;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;

  constructor(private changes: ChangeDetectorRef) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      console.log(changes);
      console.log(this.data);
      this.chartOptions = {
        series: this.data.series,
        chart: {
          width: 800,
          type: "pie"
        },
        labels: this.data.labels,
        title: {
          text: `${this.data.title}`
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 800
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ],
        colors: this.data.colors
      };
    }
  }
}
