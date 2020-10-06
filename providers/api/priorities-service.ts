import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from "@app/env";
import {Storage} from "@ionic/storage";

@Injectable()
export class PrioritiesServiceProvider {

    constructor(public http: HttpClient, public storage: Storage) {}

    getPriorities() {
        return new Promise((resolve, reject) => {
            this.http.get(`${ENV.appUrl}pedidos-venda/prioridades`)
                .subscribe((data:any) => {
                    this.storePriorities(data.data)
                    resolve(data.data)
                }, err => reject(err));
        })
    }

    storePriorities(priorities) {
        this.storage.set('priorities', priorities);
    }

    getLocalPriorities() {
        return this.storage.get('priorities');
    }
}
