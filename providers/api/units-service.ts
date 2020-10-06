import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import {Storage} from "@ionic/storage";

@Injectable()
export class UnitsServiceProvider {

    constructor(public http: HttpClient, public storage: Storage) {}

    getUnits() {
        return new Promise((resolve, reject) => {
            this.http.get(ENV.appUrl + 'unidades-medida')
                .subscribe((data:any) => {
                        this.storeUnits(data.data);
                        resolve(data.data)
                    },
                    err => reject(err));
        });
    }

    storeUnits(products) {
        this.storage.set('units', products);
    }

    getLocalUnits() {
        return this.storage.get('units');
    }
}
