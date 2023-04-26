import {Component, OnDestroy} from '@angular/core';
import {CommonModule, KeyValue, NgOptimizedImage} from '@angular/common';
import {RouterModule} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {Constants} from "../../assets/constants";
import {DataService} from "../shared/services/data.service";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import { Subject } from "rxjs";
import {MenuComponent} from "../shared/components/menu/menu.component";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

@Component({
    selector: 'app-prediction-page',
    standalone: true,
    imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatToolbarModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MenuComponent, NgOptimizedImage, MatSnackBarModule],
    templateUrl: './prediction-page.component.html',
    styleUrls: ['./prediction-page.component.scss']
})

export class PredictionPageComponent implements OnDestroy {
    public cities = Constants.Cities;
    public prediction: any[] = [];
    public cityControl = new FormControl('all');
    public destroy$: Subject<any>;
    public lastPredictionTime: string;

    constructor(public dataService: DataService, public shackBar: MatSnackBar) {
        this.dataService.getPrediction({regionName: this.cityControl.value}).then(() => {});
        this.cityControl.valueChanges.subscribe(() => {
            this.dataService.getPrediction({regionName: this.cityControl.value}).then();
            });
        this.dataService.predictionData$.subscribe((response) => {
            if (response?.data)
            {
                this.lastPredictionTime = new Date(response.data.last_prediction_time).toLocaleString()
                console.log(this.lastPredictionTime)
                const map = new Map();
                for (let key in response.data.regions_forecast) {
                    map.set(key, Array.from(new Map(Object.entries(response.data.regions_forecast[key]))));
                }
            this.prediction = Array.from(map);
            }
        })
        this.dataService.predictionUpdate$.subscribe((response) => {
            if (response) {
                this.dataService.getPrediction({regionName: this.cityControl.value}).then(() => {});
                this.shackBar.open('Prediction was updated successfully!', '', {duration: 3000, verticalPosition: "top", panelClass: ['success']})
            }
        })
    }

    public ngOnDestroy() {
        if (this.destroy$){
        this.destroy$.next(true);
        }
    }
}
