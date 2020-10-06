import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import {Storage} from "@ionic/storage";

@Injectable()
export class OutputTypeServiceProvider {

    constructor(public http: HttpClient, public storage: Storage) {}

    getOutputs() {
        return new Promise((resolve, reject) => {
            this.http.get(ENV.appUrl + 'tipos-saida/venda')
                .subscribe((data:any) => {
                        this.storeOutputs(data.data);
                        console.log('Tipos de Saída');
                        resolve(data.data)
                    },
                    err => reject(err));
        });
    }

    storeOutputs(outputs) {
        this.storage.set('outputs', outputs);
    }

    getLocalOutputs() {
        return this.storage.get('outputs');
    }

}
