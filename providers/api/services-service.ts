import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from "@app/env";

@Injectable()
export class ServicesServiceProvider {

    constructor(public http: HttpClient) {}

    getServices() {
        return new Promise((resolve, reject) => {
            this.http.get(`${ENV.appUrl}servicos`)
                .subscribe((data:any) => resolve(data.data), err => err);
        })
    }

    removeOrderService(sequencia, codigo_pedido) {
        return new Promise((resolve, reject) => {
            this.http.delete(`${ENV.appUrl}pedidos-venda/${codigo_pedido}/remove-servico/${sequencia}`)
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

}
