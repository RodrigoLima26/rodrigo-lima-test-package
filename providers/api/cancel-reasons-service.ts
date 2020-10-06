import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";
import { ENV } from '@app/env';

@Injectable()
export class CancelReasonsServiceProvider {

    constructor(public http: HttpClient, public storage: Storage) {}

    getCancelReasons() {
        return new Promise((resolve, reject) => {
            this.http.get(ENV.appUrl + 'motivos-cancelamento')
                .subscribe((data:any) => {
                        this.storeCancelReasons(data.data);
                        resolve(data.data)
                    },
                    err => reject(err));
        });
    }

    storeCancelReasons(cancel_reasons) {
        this.storage.set('cancel_reasons', cancel_reasons);
    }

    getLocalCancelReasons() {
        return this.storage.get('cancel_reasons');
    }
}
