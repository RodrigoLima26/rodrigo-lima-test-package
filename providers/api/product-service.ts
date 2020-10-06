import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import {Storage} from "@ionic/storage";
import {Events} from "ionic-angular";

@Injectable()
export class ProductServiceProvider {

    constructor(public http: HttpClient,
                public storage: Storage,
                public events: Events) {}

    /**
     * Get products list online
     * @return Promise promise
     */
    getProducts(page = 1) {

        return new Promise((resolve, reject) => {
            if(page == 1) this.destroyProducts();
            this.http.get(`${ENV.appUrl}produtos/simple?page=${page}`).subscribe((data:any) => {

                page = data.data.current_page;
                let last_page = data.data.last_page;

                console.log(page + "/" + last_page);

                this.getLocalProducts().then((products:any) => {
                    products = products ? products : [];
                    for(let item of data.data.data) products.push(item)

                    setTimeout(async () => {
                        this.storeProducts(products);
                        // publish
                        this.events.publish('home:setValues', { maxQuantity: data.data.data.length > 0 ? last_page : 0, check_size: data.data.data.length > 0 ? true : false,  });

                        if(page < last_page) await resolve(this.getProducts(page + 1))
                        else resolve(true);
                    }, 500);
                });

                this.storeProducts(data.data);
                let aux = data.data;

                resolve(data.data)
            }, err => reject(err));
        });
    }

    getPaginateProducts(page = 1, q = "") {
        return new Promise((resolve, reject) => {
            this.http.get(`${ENV.appUrl}produtos/simple?page=${page}&q=${q}`)
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

    /**
     * Get online single product
     * @param CODIGOEMPRESA
     * @return Promise promise
     */
    getSingleProduct(CODIGOEMPRESA) {
        return new Promise((resolve, reject) => {
            this.http.get(ENV.appUrl + `produtos/${CODIGOEMPRESA}`)
                .subscribe((data:any) => resolve(data.data),
                    err => reject(err));
        });
    }

    /**
     *
     * @param products
     */
    storeProducts(products) {
        this.storage.set('products', products);
    }

    /**
     *
     */
    getLocalProducts() {
       return this.storage.get('products');
    }

    /**
     *
     */
    destroyProducts() {
        this.storage.remove('products');
    }

    /**
     *
     * @param CODIGOPRODUTO
     */
    getSingleLocalProducts(CODIGOPRODUTO) {
        return new Promise((resolve, reject) => {
            this.getProducts().then((data:any = []) => {
                let index = data.map(e => e.CODIGOPRODUTO).indexOf(CODIGOPRODUTO);
                if(index != -1) resolve(data[index]);
                else reject({});
            }).catch((err) => reject(err))
        })
    }

    /**
     *
     * @param CODIGOPRODUTO
     */
    getProduct(CODIGOPRODUTO) {
        return new Promise((resolve, reject) => {
            this.http.get(`${ENV.appUrl}produtos/${CODIGOPRODUTO}`)
                .subscribe((data: any) => resolve(data.data), err => reject(err));
        })
    }

    /**
     *
     * @param codigo_pessoa
     */
    getCustomClientProducts(codigo_pessoa) {
        return new Promise((resolve, reject) => {
            this.http.get(`${ENV.appUrl}produtos/custom-client?CODIGOPESSOA=${codigo_pessoa}`)
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

    /**
     *
     * @param barcode
     */
    findWithBarcode(barcode:string) {
        return new Promise((resolve, reject) => {
            this.http.get(`${ENV.appUrl}produtos/barcode?barcode=${barcode}`)
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

    /**
     *
     * @param codigo_produto
     * @param page
     */
    getProductOuts(codigo_produto, page:any = 1) {
        return new Promise((resolve, reject) => {
            this.http.get(`${ENV.appUrl}produtos/${codigo_produto}/saidas?page=${page}`)
                .subscribe((data: any) => resolve(data.data), err => reject(err));
        })
    }

    /**
     *
     * @param codigo_produto
     */
    getStock(codigo_produto) {
        return new Promise((resolve, reject) => {
            this.http.get(`${ENV.appUrl}produtos/${codigo_produto}/estoques`)
                .subscribe((data: any) => resolve(data.data), err => reject(err));
        })
    }

    getHistory(codigo_produto, codigo_pessoa, codigo_pedido) {
        return new Promise((resolve, reject) => {
            this.http.post(`${ENV.appUrl}pessoas/${codigo_pessoa}/historico-produto/${codigo_produto}`, {NUMEROPEDIDOVENDA: codigo_pedido})
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

    removeOrderProduct(sequencia, codigo_pedido) {
        return new Promise((resolve, reject) => {
            this.http.delete(`${ENV.appUrl}pedidos-venda/${codigo_pedido}/remove-item/${sequencia}`)
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }
}
