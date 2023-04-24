import {Component, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
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

@Component({
    selector: 'app-prediction-page',
    standalone: true,
    imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatToolbarModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MenuComponent],
    templateUrl: './prediction-page.component.html',
    styleUrls: ['./prediction-page.component.scss']
})
export class PredictionPageComponent implements OnDestroy {
    public cities = Constants.Cities;
    public prediction: any;
    public cityControl = new FormControl();
    public destroy$: Subject<any>;

    constructor(public dataService: DataService) {
        this.cityControl.valueChanges.pipe(
            takeUntil(this.destroy$),
            debounceTime(0),
            tap(() => {
                this.dataService.getPrediction();
            })
        )
        this.dataService.predictionData$.subscribe((response) => {
            this.prediction = response;
            console.log(this.prediction)
        })
    }

    public ngOnDestroy() {
        if (this.destroy$){
        this.destroy$.next(true);

        }
    }
}
