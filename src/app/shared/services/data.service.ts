import {Injectable} from "@angular/core";
import {BehaviorSubject, catchError, map, retry, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import axios from 'axios';
import {Prediction} from "../placeholders/alarms-placeholder";

@Injectable({
    providedIn: "root"
})
export class DataService {

    public mergedData$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    public iswData$: BehaviorSubject<any> = new BehaviorSubject(null);
    public weather$: BehaviorSubject<any> = new BehaviorSubject(null)
    public predictionData$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    public predictionUpdate$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(private http: HttpClient) {
        // this.getPrediction({regionName: 'all'})
        // const headers = {'content-type': 'application/json'}
        // this.http.post('http://ec2-35-156-144-101.eu-central-1.compute.amazonaws.com/predictions', {regionName: 'all'}, {headers: headers})
        //     .subscribe((response) => console.log(response))
        // http.get("assets/merged.json", {responseType: "json"})
        //     .subscribe({
        //         next: (response) => {
        //             this.mergedData$.next(Object.assign([], response));
        //         }
        //     });
        // http.get("assets/isw.json", {responseType: "json"})
        //     .subscribe({
        //         next: (response) => {
        //             this.iswData$.next(Object.assign([], response));
        //         }
        //     });
        // this.postData({regionName: 'all'}).then(response => {
        //     console.log(response);
        // }).catch(error => {console.error(error)})

    }

    public getPrediction(payload?) {
        this.post('http://ec2-35-156-144-101.eu-central-1.compute.amazonaws.com/predictions', payload)
            .subscribe(
                {
                    next: (response) => {
                        this.predictionData$.next(response);
                    }
                }
            )
    }
    public updatePredictions() {
        this.post('http://ec2-35-156-144-101.eu-central-1.compute.amazonaws.com/predictions/update', {})
            .subscribe(
                {
                    next: (response) => {
                        if (response) {

                        this.predictionUpdate$.next(true);
                        }
                    }
                }
            )
    }

    public post(url, params) {
        const headers = {'content-type': 'application/json',
            'origin': window.location.origin.replace(/^https:/, 'http:'),
            'referer': window.location.origin.replace(/^https:/, 'http:')}
        return this.http.post(url, params, {headers: headers, withCredentials: true})
            .pipe(
                // timeout(1500),
                retry(2),
                map((response: any) => {
                    console.log(response);
                    if (!response || response.error) {
                        return throwError(response);
                    } else {
                        return response;
                    }
                }),
                catchError(error => {
                    return throwError(error);
                }))
    }
    postData(data: any): Promise<any> {
        return axios.post('http://ec2-35-156-144-101.eu-central-1.compute.amazonaws.com/predictions', data)
            .then(response => response.data)
            .catch(error => {
                throw new Error(error.message);
            });
    }
    async request(payload) {
        const ss = await fetch('http://ec2-35-156-144-101.eu-central-1.compute.amazonaws.com/predictions', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
                // Replace https with http in the 'Origin' header
                'Origin': window.location.origin.replace(/^https:/, 'http:')
            },
            // credentials: 'include'
        })
        const response = await ss.json();
        this.predictionData$.next(response);
        console.log(response)
    }
}
