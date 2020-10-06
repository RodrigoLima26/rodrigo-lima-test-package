import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import {UserServiceProvider} from "./user-service";

@Injectable()
export class PlansServiceProvider {

    constructor(public http: HttpClient, public userService: UserServiceProvider) {}

    getPlans() {
        return new Promise((resolve, reject) => {
            this.http.post(ENV.appUrl + 'nfe-agro/plans', {})
                .subscribe((data:any) => resolve(data.data),err => reject(err));
        });
    }

    selectPlan(plan) {
        return new Promise((resolve, reject) => {
            this.http.post(ENV.appUrl + 'nfe-agro/bill', plan)
                .subscribe((data:any) => resolve(data.data),err => reject(err));
        });
    }

    cancelPlan(plan, info) {
        return new Promise((resolve, reject) => {
            this.http.delete(ENV.appUrl + 'nfe-agro/bill-cancel', info)
                .subscribe((data:any) => {
                    this.userService.getAuthUser().then(async (data:any) => {
                        console.log(data);
                        data.empresa.nfe_agro_active_plan = null;
                        await this.userService.setAuthUser(data);
                        resolve(data)
                    })
                },err => reject(err));
        });
    }
}
