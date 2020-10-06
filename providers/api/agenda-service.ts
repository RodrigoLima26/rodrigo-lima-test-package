import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import {Storage} from "@ionic/storage";

@Injectable()
export class AgendaServiceProvider {

    constructor(public http: HttpClient, public storage: Storage) {}

    /**
     *
     */
    getAgendas() {
        return new Promise((resolve, reject) => {
            this.http.get(ENV.appUrl + `agenda/salesman`)
                .subscribe((data:any) => {
                        this.storeAgenda(data.data);
                        resolve(data.data)
                    }, err => reject(err));
        });
    }

    /**
     *
     * @param year_month
     */
    getAgendaByYearAndMonth(year_month) {
        return new Promise((resolve, reject) => {
            this.http.get(`${ENV.appUrl}agenda/salesman/${year_month}`)
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

    /**
     *
     * @param agenda
     */
    newAgenda(agenda) {
        return new Promise((resolve, reject) => {
            this.http.post(`${ENV.appUrl}agenda/save`, agenda)
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

    /**
     *
     * @param billing_types
     */
    storeAgenda(agenda) {
        this.storage.set('agenda', agenda);
    }

    /**
     *
     */
    getLocalAgenda() {
        return this.storage.get('agenda');
    }

    getAgendaTypes() {
        return new Promise((resolve, reject) => {
            this.http.get(`${ENV.appUrl}tipo-agenda`)
                .subscribe((data:any) => {
                    this.storeAgendaTypes(data.data);
                    resolve(data.data);
                }, err => reject(err));
        })
    }

    /**
     *
     * @param billing_types
     */
    storeAgendaTypes(agenda_types) {
        this.storage.set('agenda_types', agenda_types);
    }

    /**
     *
     */
    getLocalAgendaTypes() {
        return this.storage.get('agenda_types');
    }

    /**
     *
     * @param sequence
     */
    accomplishAgenda(sequence) {
        return new Promise((resolve, reject) => {
            return this.http.post(`${ENV.appUrl}agenda/${sequence}/accomplish`, {})
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }
}

