import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';

@Injectable()
export class VisitControlServiceProvider {

    constructor(public http: HttpClient) {}

    getVisitsControl() {
        return new Promise((resolve, reject) => {
            this.http.get(`${ENV.appUrl}visita-cliente/salesman`).subscribe((data: any) => resolve(data.data), err => reject(err))
        })
    }

    saveVisitControl(visit) {
        return new Promise((resolve, reject) => {
            this.http.post(`${ENV.appUrl}visita-cliente/save`, visit)
                .subscribe((data:any) => resolve(data), err => reject(err));
        })
    }

    deleteVisit(visit:any) {
        return new Promise((resolve, reject) => {
            this.http.delete(`${ENV.appUrl}visita-cliente/${visit.SEQUENCIA}/delete`)
                .subscribe((data:any) => resolve(data), err => reject(err));
        })
    }
}
