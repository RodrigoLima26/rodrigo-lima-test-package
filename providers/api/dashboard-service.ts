import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import {Storage} from "@ionic/storage";

@Injectable()
export class DashboardServiceProvider {

    constructor(public http: HttpClient, public storage: Storage) {}

    /**
     * Get dashboard info online
     * @return Promise promise
     */
    getDashboard() {
        return new Promise((resolve, reject) => {
            this.http.get(ENV.appUrl + 'dashboard')
                .subscribe((data:any) => {
                        this.storeDashboard(data.data);
                        resolve(data.data)
                    }, err => reject(err));
        });
    }

    storeDashboard(dashboard) {
        this.storage.set('dashboard', dashboard);
    }

    getLocalDashboard() {
        return this.storage.get('dashboard');
    }

    getPerformance() {
        return new Promise((resolve, reject) => {
            return this.http.get(`${ENV.appUrl}dashboard/performance`)
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

    getGoals() {
        return new Promise((resolve, reject) => {
            return this.http.get(`${ENV.appUrl}dashboard/metas`)
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

    getDashboardGraphs() {
        return new Promise((resolve, reject) => {
            return this.http.get(`${ENV.appUrl}dashboard/faturamento`)
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

}
