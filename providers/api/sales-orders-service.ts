import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";
import { ENV } from "@app/env";

@Injectable()
export class SalesOrdersServiceProvider {

    constructor(public http: HttpClient,
                public storage: Storage) {}

    storeBackupOrder(sale_order) {
        this.storage.set('backup_sale_order', sale_order);
    }

    getBackupOrder() {
        return this.storage.get('backup_sale_order');
    }

    clearBackupOrder() {
        return this.storage.remove('backup_sale_order');
    }

    saveSalesOrder(sales_order) {
        return new Promise((resolve, reject) => {
            this.http.post(`${ENV.appUrl}pdv/concluir`, sales_order)
                .subscribe((data: any) => resolve(data.data), err => reject(err));
        })
    }

    getPrintData(numero_documento_saida) {
        return new Promise((resolve, reject) => {
            this.http.post(`${ENV.appUrl}pdv/${numero_documento_saida}/print-directly?prefers_nfce=1&esc_pos=1`, {})
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

    getSalesOrders(data:any = {}) {

        delete data.cliente;

        return new Promise((resolve, reject) => {
            this.http.get(`${ENV.appUrl}pdv/list-salesman`, {params: data})
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        });
    }

    findSaleOrder(pedidovenda) {
        return new Promise((resolve, reject) => {
            this.http.get(ENV.appUrl+`pdv/${pedidovenda}`)
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        });
    }
}
