import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {Papa} from "ngx-papaparse";
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexDataLabels,
    ApexFill,
    ApexMarkers,
    ApexStroke,
    ApexTheme,
    ApexTitleSubtitle,
    ApexTooltip,
    ApexXAxis,
    ApexYAxis,
    NgApexchartsModule
} from "ng-apexcharts";
import {MatButtonModule} from "@angular/material/button";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {Constants} from "../../assets/constants";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime";
import {MatIconModule} from "@angular/material/icon";
import {DataService} from "../shared/services/data.service";
import {PieChartComponent} from "../shared/components/pie-chart/pie-chart.component";
import {
    NullValuesLineChartComponent
} from "../shared/components/null-values-line-chart/null-values-line-chart.component";
import {ColumnChartComponent} from "../shared/components/column-chart/column-chart.component";
import {RadarChartComponent} from "../shared/components/radar-chart/radar-chart.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {RouterLink, RouterModule} from "@angular/router";
import {MatDividerModule} from "@angular/material/divider";
import {MenuComponent} from "../shared/components/menu/menu.component";

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
    selector: "app-charts-page",
    standalone: true,
    imports: [CommonModule, NgApexchartsModule, MatButtonModule,
        MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule, MatDatepickerModule,
        MatNativeDateModule, OwlDateTimeModule, MatIconModule, OwlNativeDateTimeModule, PieChartComponent, NullValuesLineChartComponent,
        ColumnChartComponent, RadarChartComponent, MatToolbarModule, RouterLink,
        RouterModule, MatDividerModule, MenuComponent],
    templateUrl: "./charts-page.component.html",
    styleUrls: ["./charts-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ChartsPageComponent {

    public mergedData: any;
    public iswData: any;
    public averageData: any;

    public cities = Constants.Cities;
    public form = this.fb.group({
        alarmForm: this.fb.group({
            city: ["Kyiv"],
            dateStart: [new Date("2/24/2022, 12:00 PM")],
            dateEnd: [new Date("3/24/2022, 12:00 AM")],
            parameter: [""]
        })
    });

    public showChart = false;
    public pieChart = {
        series: [],
        labels: [""],
        title: "",
        colors: [""]
    };
    public alarmsNumberChart = {
        series: [],
        labels: [""],
        title: "",
        color: ""
    };
    public nullValuesChart: any = {
        temperatureData: [],
        windSpeedData: [],
        cloudCoverData: [],
        startDate: "",
        endDate: "",
        city: ""
    };
    public avgPrecipChart: any = {
        series: [],
        labels: [],
        startDate: "",
        endDate: "",
        color: ''
    };
    public avgTempChart: any = {
        series: [],
        labels: [],
        startDate: "",
        endDate: "",
        color: ''
    };
    public tfIdfValuesChart = {
        series: [],
        labels: [""],
        title: "",
        color: '',
    };
    public weatherConditionNumberChart = {
        series: [],
        labels: [""],
        title: "",
        color: ""
    };
    public tab

    constructor(private papa: Papa,
                private fb: FormBuilder,
                public dataService: DataService,
                private changes: ChangeDetectorRef) {
        dataService.mergedData$.subscribe({
            next: (response) => {
                if (response) {
                    this.mergedData = response;
                    this.initCharts();
                    this.changes.detectChanges();

                }
            }
        });
        dataService.iswData$.subscribe({
            next: (response) => {
                if (response) {
                    this.iswData = response;
                    console.log(this.iswData);
                    this.initISWDataChart();
                    this.changes.detectChanges();

                }
            }
        });
    }

    get startDate() {
        return new Date(this.form.get("alarmForm")?.get("dateStart")?.value as Date);
    }

    get endDate() {
        return new Date(this.form.get("alarmForm")?.get("dateEnd")?.value as Date);
    }

    countAverage() {
        const cityAveragesMap = new Map<string, any>();
        for (const data of this.mergedData) {
            const {city, hour_cloudcover, hour_windspeed, hour_temp} = data;

            if (!cityAveragesMap.has(city)) {
                cityAveragesMap.set(city, {
                    city,
                    hour_cloudcover_avg: 0,
                    hour_windspeed_avg: 0,
                    hour_temp_avg: 0
                });
            }
            if (data.event_start_time) {
                // console.log(data);
            }

            const averages = cityAveragesMap.get(city)!;
            const count = Object.keys(averages).length - 1; // exclude city key

            averages.hour_cloudcover_avg =
                (averages.hour_cloudcover_avg * count + parseFloat(hour_cloudcover)) /
                (count + 1);
            averages.hour_windspeed_avg =
                (averages.hour_windspeed_avg * count + parseFloat(hour_windspeed)) /
                (count + 1);
            averages.hour_temp_avg =
                (averages.hour_temp_avg * count + parseFloat(hour_temp)) / (count + 1);
        }

        this.averageData = Array.from(cityAveragesMap.values());
        console.log(this.averageData);
    }

    public initCharts() {
        this.initAvgTempData();
        this.initPieChartData();
        this.initNullValuesChart();
        this.initPrecipitationData();
        this.initAlarmsNumberChart();
        this.initWeatherConditionNumberChart();
        this.changes.detectChanges();
    }

    public initNullValuesChart() {
        this.nullValuesChart.temperatureData = [];
        this.nullValuesChart.cloudCoverData = [];
        this.nullValuesChart.windSpeedData = [];
        const dateStartS = this.startDate.getTime() / 1000;
        const dateEndS = this.endDate.getTime() / 1000;
        const city = this.form.get("alarmForm")?.get("city")?.value as string;
        // let data = this.mergedData.filter(record => (record.center_city_en === city && Number(record.hour_datetimeEpoch) >= dateStartS && Number(record.hour_datetimeEpoch) <= dateEndS));
        let data = this.mergedData.filter(record => (record.center_city_en === city));
        // data = data.filter((item, index) => {
        //   return index == data.findIndex(obj => obj?.hour_datetimeEpoch === item?.hour_datetimeEpoch);
        // });
        data.forEach(el => {
            this.nullValuesChart.temperatureData.push({
                x: (new Date(el.hour_datetimeEpoch * 1000)),
                y: el.event_start_hour ? el.hour_temp : null
            });
            this.nullValuesChart.cloudCoverData.push({
                x: (new Date(el.hour_datetimeEpoch * 1000)),
                y: el.event_start_hour ? el.hour_cloudcover : null
            });
            this.nullValuesChart.windSpeedData.push({
                x: (new Date(el.hour_datetimeEpoch * 1000)),
                y: el.event_start_hour ? el.hour_windspeed : null
            });
        });
        const startDate = this.startDate.toLocaleString();
        const endDate = this.endDate.toLocaleString();
        this.nullValuesChart = {...this.nullValuesChart, startDate, endDate, city};
    };

    public initPieChartData() {
        const startDateS = this.startDate.getTime() / 1000;
        const endDateS = this.endDate.getTime() / 1000;
        const result: any = {};
        let data = this.mergedData.filter(record => Number(record.hour_datetimeEpoch) >= startDateS && Number(record.hour_datetimeEpoch) <= endDateS);
        console.log('PIE DATA', data);
        for (const rec of this.mergedData) {
            if (rec.event_start_hour) {
                const city = rec.center_city_en;
                result[city] = (result[city] || 0) + 1;
            }
        }
        const startDate = this.startDate.toLocaleString();
        const endDate = this.endDate.toLocaleString();
        console.log(result);
        this.pieChart = {
            series: Object.values(result),
            labels: Object.keys(result),
            title: `Ratio of airborne alarms between all cities (%)`,
            colors: ["#FF5733", "#FFC300", "#C70039", "#4600ce", "#FF5733",
                "#01FF70", "#FFC300", "#FF4136", "#ca11ff", "#01FF70",
                "#FF851B", "#B10DC9", "#009fd9", "#FFDC00", "#F012BE",
                "#008510", "#FF4136", "#a84b00", "#01FF70", "#85144b",
                "#daa4c9", "#ffae00", "#FFDC00", "#0074D9"]
        };
    }

    public initPrecipitationData() {
        let avgDayPrecipByCity = {};

        const startDateS = this.startDate.getTime() / 1000;
        const endDateS = this.endDate.getTime() / 1000;
        //&& Number(record.hour_datetimeEpoch) >= startDateS && Number(record.hour_datetimeEpoch) <= endDateS
        this.mergedData.filter(record => record.event_start_hour).forEach((entry) => {

            if (!avgDayPrecipByCity[entry.center_city_en]) {
                console.log(entry.center_city_en);
                avgDayPrecipByCity[entry.center_city_en] = {totalPrecip: 0, count: 0};
            }
            avgDayPrecipByCity[entry.center_city_en].totalPrecip += parseInt(entry.day_precipcover);
            avgDayPrecipByCity[entry.center_city_en].count++;
        });

        let result: any = {};

        for (let city in avgDayPrecipByCity) {
            let avgPrecip = avgDayPrecipByCity[city].totalPrecip / avgDayPrecipByCity[city].count;
            result[city] = avgPrecip.toFixed(2);
        }
        console.log(result);
        const startDate = this.startDate.toLocaleString();
        const endDate = this.endDate.toLocaleString();
        const entries = Object.entries(result);
        entries.sort((a: any, b: any) => b[1] - a[1]);
        const sortedRes = Object.fromEntries(entries);
        this.avgPrecipChart = {
            series: Object.values(sortedRes),
            labels: Object.keys(sortedRes),
            color: '#4c7eff',
            title: `Average precipitation amount during raid alarms in all cities`
        };
        console.log(this.avgPrecipChart);
    }

    public initAvgTempData() {
        let avgDayTempByCity = {};

        const startDateS = this.startDate.getTime() / 1000;
        const endDateS = this.endDate.getTime() / 1000;
        //&& Number(record.hour_datetimeEpoch) >= startDateS && Number(record.hour_datetimeEpoch) <= endDateS
        this.mergedData.forEach((entry) => {

            if (!avgDayTempByCity[entry.center_city_en]) {
                console.log(entry.center_city_en);
                avgDayTempByCity[entry.center_city_en] = {totalTemp: 0, count: 0};
            }
            avgDayTempByCity[entry.center_city_en].totalTemp += parseInt(entry.day_temp);
            avgDayTempByCity[entry.center_city_en].count++;
        });

        let result: any = {};

        for (let city in avgDayTempByCity) {
            let avgPrecip = avgDayTempByCity[city].totalTemp / avgDayTempByCity[city].count;
            result[city] = avgPrecip.toFixed(2);
        }
        console.log(result);
        delete result['undefined'];
        const startDate = this.startDate.toLocaleString();
        const endDate = this.endDate.toLocaleString();
        const entries = Object.entries(result);
        entries.sort((a: any, b: any) => b[1] - a[1]);
        const sortedRes = Object.fromEntries(entries);
        this.avgTempChart = {
            series: Object.values(sortedRes),
            labels: Object.keys(sortedRes),
            color: '#14c9b7',
            title: `Average temperature in all cities`
        };
        console.log(this.avgPrecipChart);
    }

    public initAlarmsNumberChart() {
        const startDateS = this.startDate.getTime() / 1000;
        const endDateS = this.endDate.getTime() / 1000;

        const res = {};
        let data = this.mergedData.filter(record => record.event_start_hour);
        for (let record of data) {
            if (!res[record.hour_conditions]) {
                res[record.hour_conditions] = 0;
            }
            res[record.hour_conditions] += 1;
        }
        const startDate = this.startDate.toLocaleString();
        const endDate = this.endDate.toLocaleString();
        const entries = Object.entries(res);
        entries.sort((a: any, b: any) => b[1] - a[1]);
        const sortedRes: any = Object.fromEntries(entries);
        this.alarmsNumberChart = {
            series: Object.values(sortedRes),
            labels: Object.keys(sortedRes),
            title: `Number of Raid Alarms during different weather conditions`,
            color: '#fce03a'
        };
    }

    public initWeatherConditionNumberChart() {
        const startDateS = this.startDate.getTime() / 1000;
        const endDateS = this.endDate.getTime() / 1000;

        const res = {};
        let data = this.mergedData.filter(record => Number(record.hour_datetimeEpoch) >= startDateS && Number(record.hour_datetimeEpoch) <= endDateS);
        for (let record of this.mergedData) {
            if (!res[record.hour_conditions]) {
                res[record.hour_conditions] = 0;
            }
            res[record.hour_conditions] += 1;
        }
        const startDate = this.startDate.toLocaleString();
        const endDate = this.endDate.toLocaleString();
        const entries = Object.entries(res);
        entries.sort((a: any, b: any) => b[1] - a[1]);
        const sortedRes: any = Object.fromEntries(entries);
        this.weatherConditionNumberChart = {
            series: Object.values(sortedRes),
            labels: Object.keys(sortedRes),
            title: `Number of different weather conditions`,
            color: '#43ad1c'
        };
    }

    public initISWDataChart() {
        const avg = {};
        const res = {};
        for (let record of this.iswData) {
            Object.keys(record).forEach(key => {
                if (!avg[key]) {
                    avg[key] = {total: 0, count: 0};
                }
                avg[key].total += parseFloat(record[key]);
                avg[key].count++;
            });
        }
        console.log(avg);
        delete avg["isw_date"];
        for (let item in avg) {
            let avgTf = avg[item].total / avg[item].count;
            res[item] = avgTf.toFixed(5);
        }
        const entries = Object.entries(res);
        entries.sort((a: any, b: any) => b[1] - a[1]);
        const sortedRes = Object.fromEntries(entries);
        this.tfIdfValuesChart = {
            series: Object.values(sortedRes).slice(0, 20) as [],
            labels: Object.keys(sortedRes).slice(0, 20),
            color: '#FF5733',
            title: "Top 20 most valuable terms"
        };
    }

    changeTab(id) {

    }
}
