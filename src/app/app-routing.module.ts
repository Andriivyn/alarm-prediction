import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChartsPageComponent} from './charts-page/charts-page.component';
import {PredictionPageComponent} from "./prediction-page/prediction-page.component";
import {MainPageComponent} from "./main-page/main-page.component";

const routes: Routes = [
    {path: 'main', component: MainPageComponent, pathMatch: 'full'},
    {path: 'statistic', component: ChartsPageComponent, pathMatch: 'full'},
    {path: 'prediction', component: PredictionPageComponent, pathMatch: 'full'},
    {path: '**', redirectTo: 'main'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
