import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import {Storage} from "@ionic/storage";

@Injectable()
export class PeopleServiceProvider {

    constructor(public http: HttpClient, public storage: Storage) {}

    /**
     * Get people list online
     * @return Promise promise
     */
    getPeople() {
        return new Promise((resolve, reject) => {
            this.http.get(ENV.appUrl + 'pessoas/simple')
                .subscribe((data:any) => {
                        this.storePeople(data.data);
                        resolve(data.data)
                    }, err => reject(err));
        });
    }

    /**
     * Get person full information
     * @param id
     */
    getPersonById(id) {
        return new Promise((resolve, reject) => {
            this.http.get(`${ENV.appUrl}pessoas/${id}`)
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        });
    }

    /**
     * Get online shipping company
     * @return Promise promise
     */
    getShippingCompany() {
        return new Promise((resolve, reject) => {
            this.http.get(ENV.appUrl + 'pessoas/transportadoras')
                .subscribe((data:any) => {
                        this.storeShippingCompany(data.data);
                        resolve(data.data)
                    },
                    err => reject(err));
        });
    }

    /**
     *
     * @param people
     */
    storePeople(people) {
        this.storage.set('clients', people);
    }

    /**
     *
     * @param shipping_companies
     */
    storeShippingCompany(shipping_companies) {
        this.storage.set('shipping_companies', shipping_companies);
    }

    /**
     *
     */
    getLocalPeople() {
        return this.storage.get('clients');
    }

    /**
     *
     */
    getLocalShippingCompany() {
        return this.storage.get('shipping_companies');
    }

    newCnpj(client) {
        return new Promise((resolve, reject) => {
            this.http.post(ENV.appUrl + 'pessoas/store-cnpj', client)
                .subscribe((data:any) => resolve(data.data),
                    err => reject(err));
        });
    }

    getFinanceSummary(codigo) {
        return new Promise((resolve, reject) => {
            this.http.post(`${ENV.appUrl}pessoas/${codigo}/resumo-financeiro`, {})
                .subscribe((data: any) => resolve(data.data), err => reject(err));
        })
    }

    getCupons(codigo_pessoa) {
        return new Promise((resolve, reject) => {
            this.http.get(`${ENV.appUrl}pessoas/${codigo_pessoa}/vale-presentes?COM_SALDO=1`)
                .subscribe((data:any) => resolve(data.data), err => reject(err))
        })
    }
}
