import {Injectable} from "@angular/core";
import {BehaviorSubject, catchError, map, retry, Subject, throwError, timeout} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Constants} from "../../../assets/constants";
import {Prediction} from "../placeholders/alarms-placeholder";

@Injectable({
    providedIn: "root"
})
export class DataService {

    public mergedData$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    public iswData$: BehaviorSubject<any> = new BehaviorSubject(null);
    public weather$: BehaviorSubject<any> = new BehaviorSubject(null)
    public predictionData$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private predictionData = Prediction;

    constructor(private http: HttpClient) {
        this.getPrediction()
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
    }

    public getPrediction(payload?) {
        this.predictionData$.next(this.predictionData);
        //TODO fetch from url

    }

    public post(url, params) {
        return this.http.post(url, params)
            .pipe(
                timeout(15000),
                retry(2),
                map((response: any) => {
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
}
