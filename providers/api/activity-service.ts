import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import {Storage} from "@ionic/storage";

@Injectable()
export class ActivityServiceProvider {

    constructor(public http: HttpClient, public storage: Storage) {}

    /**
     * Get Activities online
     * @return Promise promise
     */
    getActivities() {
        return new Promise((resolve, reject) => {
            this.http.get(ENV.appUrl + 'ramos-atividade')
                .subscribe((data:any) => {
                        this.storeActivities(data.data);
                        resolve(data.data)
                    }, err => reject(err));
        });
    }

    /**
     *
     * @param activities
     */
    storeActivities(activities) {
        this.storage.set('activities', activities);
    }

    /**
     *
     */
    getLocalActivities() {
        return this.storage.get('activities');
    }

}
