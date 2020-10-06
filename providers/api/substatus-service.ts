import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from "@app/env";
import {Storage} from "@ionic/storage";

@Injectable()
export class SubstatusServiceProvider {

    constructor(public http: HttpClient, public storage: Storage) {}

    getSubstatus() {
        return new Promise((resolve, reject) => {
            this.http.get(`${ENV.appUrl}pedidos-venda/sub-status`)
                .subscribe((data:any) => {
                    this.storeSubstatus(data.data);
                    resolve(data.data)
                }, err => reject(err));
        })
    }

    storeSubstatus(substatus) {
        this.storage.set('substatus', substatus);
    }

    getLocalSubstatus() {
        return this.storage.get('substatus');
    }

}
