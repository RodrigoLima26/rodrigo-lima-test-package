import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import {Storage} from "@ionic/storage";

@Injectable()
export class OrdersServiceProvider {

    constructor(public http: HttpClient, public storage: Storage) {}

    getOrders(data:any = {}) {
        let aux = "";
        if(data.STATUS && data.STATUS.length > 0) {
            for(let i = 0; i < data.STATUS.length; i++) {
                if(i == 0) aux = `?STATUS[]=${data.STATUS[i]}`;
                else aux += `&STATUS[]=${data.STATUS[i]}`;
            }
        }

        delete data.STATUS;
        delete data.cliente;

        return new Promise((resolve, reject) => {
            this.http.get(`${ENV.appUrl}pedidos-venda/list-salesman${aux}`, {params: data})
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        });
    }

    storeOrders(orders) {
        this.storage.set('orders', orders);
    }

    getLocalOrders() {
        return this.storage.get('orders');
    }

    saveOrder(order, type = null) {
        let url = ENV.appUrl + 'pedidos-venda/save';

        // Set Status Confirm
        if (type == 'confirm')
            url = `${ENV.appUrl}pedidos-venda/${order.NUMEROPEDIDOVENDA}/confirm`;

        return new Promise((resolve, reject) => {
            this.http.post(url, order).subscribe((data: any) => {
                resolve(data.data);
            }, err => reject(err));
        });
    }

    findOrder(order_id) {
        return new Promise((resolve, reject) => {
            this.http.get(ENV.appUrl+`pedidos-venda/${order_id}`)
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        });
    }

    cancelOrder(order_id, reasons) {
        return new Promise((resolve, reject) => {
            this.http.post(`${ENV.appUrl}pedidos-venda/${order_id}/cancel`, reasons)
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        });
    }

    createFollowUp(follow_up, order_id) {
        return new Promise((resolve, reject) => {
            this.http.post(`${ENV.appUrl}pedidos-venda/${order_id}/follow-up`, follow_up)
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

    sendEmail(email_list = [], client_email, order_id) {

        let aux = "";
        if(email_list.length > 0) {
            for(let i = 0; i < email_list.length; i++) {
                if(i == 0) aux = `?EMAILS[]=${email_list[i]}`;
                else aux += `&EMAILS[]=${email_list[i]}`;
            }
        }

        return new Promise((resolve, reject) => {
            this.http.post(`${ENV.appUrl}pedidos-venda/${order_id}/notify${aux}`, {EMAIL: client_email})
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

    getOrderShareLink(order_id) {
        return new Promise((resolve, reject) => {
            this.http.post(`${ENV.appUrl}pedidos-venda/${order_id}/print`, {})
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

    changePriceTable(order) {
        return new Promise((resolve, reject) => {
            this.http.post(`${ENV.appUrl}pedidos-venda/${order.NUMEROPEDIDOVENDA}/save-price-table`, {PRECOTABELA: order.PRECOTABELA})
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

    billOrder(order) {
        return new Promise((resolve, reject) => {
            this.http.post(`${ENV.appUrl}pedidos-venda/${order.NUMEROPEDIDOVENDA}/faturar`, order)
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

    getDocumentsPrint(type, scope_id) {
        return new Promise((resolve, reject) => {
            this.http.get(`${ENV.appUrl}${type}/${scope_id}/print`)
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

    copyOrder(order) {
        return new Promise((resolve, reject) => {
            this.http.post(`${ENV.appUrl}pedidos-venda/${order.NUMEROPEDIDOVENDA}/copy`, {})
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

    separationOrder(order) {
        return new Promise((resolve, reject) => {
            this.http.post(`${ENV.appUrl}pedidos-venda/${order.NUMEROPEDIDOVENDA}/enviar-separacao`, {})
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

    savePhoto(numero_pedido, imageUri) {
        return new Promise((resolve, reject) => {
            this.http.post(`${ENV.appUrl}pedidos-venda/${numero_pedido}/add-anexo`, {base64: imageUri})
                .subscribe((data: any) => resolve(data.data), err => reject(err));
        })
    }

    removePhoto(numero_pedido) {
        return new Promise((resolve, reject) => {
            this.http.delete(`${ENV.appUrl}pedidos-venda/${numero_pedido}/del-anexo`)
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

    getPrintData(numero_pedido) {
        return new Promise((resolve, reject) => {
            this.http.post(`${ENV.appUrl}pedidos-venda/${numero_pedido}/print-directly`, {})
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }
}
