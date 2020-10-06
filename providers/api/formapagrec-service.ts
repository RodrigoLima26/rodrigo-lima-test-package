import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ENV} from "@app/env";
import {Storage} from "@ionic/storage";

@Injectable()
export class FormapagrecServiceProvider {

    constructor(public http: HttpClient, public storage: Storage) {}

    getFormaPagRec() {
        return new Promise((resolve, reject) => {
            this.http.get(ENV.appUrl + 'formapagrec')
                .subscribe((data:any) => {
                    this.storeFormaPagRec(data.data);
                    resolve(data.data)
                }, err => reject(err));
        });
    }

    /**
     *
     * @param formapagrec
     */
    storeFormaPagRec(formapagrec) {
        this.storage.set('formapagrec', formapagrec);
    }

    /**
     *
     */
    getLocalFormaPagRec() {
        return this.storage.get('formapagrec');
    }
}
