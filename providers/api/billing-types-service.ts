import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';

@Injectable()
export class BillingTypesServiceProvider {

    constructor(public http: HttpClient, public storage: Storage) {}

    /**
     * Get list of billing types online
     *
     * @return Promise promise
     */
    getBillingTypes() {
        return new Promise((resolve, reject) => {
            this.http.get(ENV.appUrl + `tipos-cobranca`)
                .subscribe((data:any) => {
                        this.storeBillingTypes(data.data);
                        resolve(data.data)
                    },
                    err => reject(err));
        });
    }

    /**
     *
     * @param billing_types
     */
    storeBillingTypes(billing_types) {
        this.storage.set('billing_types', billing_types);
    }

    /**
     *
     */
    getLocalBillingTypes() {
        return this.storage.get('billing_types');
    }
}
