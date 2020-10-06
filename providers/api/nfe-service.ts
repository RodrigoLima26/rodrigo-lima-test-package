import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ENV } from '@app/env';

@Injectable()
export class NfeServiceProvider {

    constructor(public http: HttpClient, public storage: Storage) {}

    /**
     * Get list of NFes online
     *
     * @param DATAEMISSAO_BEGIN
     * @param DATAEMISSAO_END
     * @return Promise promise
     */
    getNFes(DATAEMISSAO_BEGIN, DATAEMISSAO_END) {
        return new Promise((resolve, reject) => {
            this.http.get(ENV.appUrl + `pedidos-venda?DATAEMISSAO_BEGIN=${DATAEMISSAO_BEGIN}&DATAEMISSAO_END=${DATAEMISSAO_END}`)
                .subscribe((data:any) => resolve(data.data),
                    err => reject(err));
        });
    }

    /**
     * Store local Nfe
     * @param nfe
     */
    storeTempNfe(nfe) {
        this.storage.set(`nfe_${nfe.unique_id}`, nfe);
    }

    /**
     * get single nfe on storage
     * @param unique_id
     */
    getLocalNfe(unique_id) {
        return this.storage.get(`nfe_${unique_id}`);
    }

    /**
     * Get all nfes on storage
     */
    getAllLocalNfe() {
        let nfe_list :any = [];

        return this.storage.forEach((value, key, index) => {
            if (key.startsWith('nfe_')) {
                nfe_list.push(value);
            }
        })
            .then(() => Promise.resolve(nfe_list))
            .catch((error) => Promise.reject(error));
    }

    /**
     *
     */
    removeNfe(unique_id) {
        this.storage.remove(`nfe_${unique_id}`);
    }

    sendNfe(nfe) {
        return new Promise((resolve, reject) => {
            this.http.post(ENV.appUrl + `pedidos-venda/faturar-nfe`, nfe)
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        });
    }

    cancelNfe(numero_interno, motivo) {
        return new Promise((resolve, reject) => {
            this.http.post(ENV.appUrl + `nfe/${numero_interno}/cancel`, {motivo: motivo})
                .subscribe((data:any) => resolve(data.data), err => reject(err))
        });
    }

}
