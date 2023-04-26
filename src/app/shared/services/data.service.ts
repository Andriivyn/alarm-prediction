import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import axios from 'axios';

@Injectable({
    providedIn: "root"
})
export class DataService {

    public mergedData$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    public iswData$: BehaviorSubject<any> = new BehaviorSubject(null);
    public weather$: BehaviorSubject<any> = new BehaviorSubject(null)
    public predictionData$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    public predictionUpdate$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor() {}

    public async getPrediction(payload?) {
        await axios.post('http://ec2-35-156-144-101.eu-central-1.compute.amazonaws.com/predictions', payload)
            .then((response) => this.predictionData$.next(response))
    }

    public async updatePredictions() {
        await axios.post('http://ec2-35-156-144-101.eu-central-1.compute.amazonaws.com/predictions/update')
            .then(() => {
                this.predictionUpdate$.next(true)
            })
    }
}
