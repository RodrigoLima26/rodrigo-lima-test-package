import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import {Storage} from "@ionic/storage";

@Injectable()
export class PaymentPlanServiceProvider {

    constructor(public http: HttpClient, public storage: Storage) {}

    /**
     * Get payment plans online
     * @return Promise promise
     */
    getPaymentPlans() {
        return new Promise((resolve, reject) => {
            this.http.get(ENV.appUrl + 'planos-pagamento')
                .subscribe((data:any) => {
                        this.storePaymentPlans(data.data);
                        resolve(data.data)
                    },
                    err => reject(err));
        });
    }

    /**
     *
     * @param payment_plans
     */
    storePaymentPlans(payment_plans) {
        this.storage.set('payment_plans', payment_plans);
    }

    /**
     *
     */
    getLocalPaymentPlans() {
        return this.storage.get('payment_plans');
    }
}
