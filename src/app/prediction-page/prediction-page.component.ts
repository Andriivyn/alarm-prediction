import {Component, OnDestroy} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterModule} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {Constants} from "../../assets/constants";
import {DataService} from "../shared/services/data.service";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, Subject, takeUntil, tap} from "rxjs";
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
    public prediction: any;
    public cityControl = new FormControl('all');
    public destroy$: Subject<any>;

    constructor(public dataService: DataService, public shackBar: MatSnackBar) {
        this.dataService.getPrediction({regionName: this.cityControl.value});
        this.cityControl.valueChanges.subscribe(() => {
                this.dataService.getPrediction({regionName: this.cityControl.value});
            });
        this.dataService.predictionData$.subscribe((response) => {
            this.prediction = response;
        })
        this.dataService.predictionUpdate$.subscribe((response) => {
            if (response) {
                this.dataService.getPrediction({regionName: this.cityControl.value});
                this.shackBar.open('Prediction was updated successfully!', '', {duration: 30000000, panelClass: ['success']})
            }
        })
    }

    public ngOnDestroy() {
        if (this.destroy$){
        this.destroy$.next(true);
        }
    }
}
