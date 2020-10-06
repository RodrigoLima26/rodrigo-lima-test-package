import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';

@Injectable()
export class IcmsServiceProvider {

    constructor(public http: HttpClient) {}

    getICMS({DT_MOVIMENTO_BEGIN = null, DT_MOVIMENTO_END = null, CODIGOEMPRESA = 'Todos'}) {

        let request_url:any = `nfe-agro/movimentacao-icms?DT_MOVIMENTO_BEGIN=${DT_MOVIMENTO_BEGIN}&DT_MOVIMENTO_END=${DT_MOVIMENTO_END}`
        if(CODIGOEMPRESA !== 'Todos')
            request_url = request_url+`&CODIGOEMPRESA=${CODIGOEMPRESA}`;

        return new Promise((resolve, reject) => {
            this.http.get(ENV.appUrl + request_url)
                .subscribe((data:any) => resolve(data.data),
                    err => reject(err));
        });
    }

    firstContact(first_contact) {
        return new Promise((resolve, reject) => {
            this.http.post(ENV.appUrl+'nfe-agro/calculadora/first-contact', first_contact)
                .subscribe((data:any) => resolve(data.data),
                           err => reject(err))
        })
    }

    calculate(icms, access_token) {
        return new Promise((resolve, reject) => {
            this.http.post(ENV.appUrl+`nfe-agro/calculadora/${access_token}/calculate`, icms)
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

    register(access_token) {
        return new Promise((resolve, reject) => {
            this.http.post(ENV.appUrl+`nfe-agro/calculadora/${access_token}/info-register`, {})
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

    infoRegister(access_token) {
        return new Promise((resolve, reject) => {
            this.http.post(ENV.appUrl+`nfe-agro/calculadora/${access_token}/info-register`, {})
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

    bill(access_token, icms) {
        return new Promise((resolve, reject) => {
            this.http.post(ENV.appUrl+`nfe-agro/calculadora/${access_token}/info-register`, icms)
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }
}
