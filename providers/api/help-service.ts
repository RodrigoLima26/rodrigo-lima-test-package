import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ENV } from '@app/env';

@Injectable()
export class HelpServiceProvider {

    constructor(public http: HttpClient, public storage: Storage) {}

    getHelpInfo() {
        return new Promise((resolve, reject) => {
            this.http.get(ENV.appUrl + 'nfe-agro/help/info')
                .subscribe((data:any) => {
                    this.storeHelpInfo(data.data);
                    resolve(data.data)
                }, err => reject(err));
        });
    }

    storeHelpInfo(data) {
        this.storage.set('help', data);
    }

    getLocalHelpInfo() {
        return this.storage.get('help');
    }
}
