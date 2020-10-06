import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ENV} from "@app/env";

@Injectable()
export class CreditCardProvider {

    constructor(public http: HttpClient) {}

    /**
     *
     */
    public getCreditCards() {

        return new Promise((resolve, reject) => {
            this.getLocalCreditCards().subscribe(
                response => resolve(response),
                error => reject(error)
            );
        });
    }

    /**
     *
     */
    public getLocalCreditCards() {
        return this.http.get('./assets/data/credit_cards.json');
    };

    public getCard(card_number) {
        return new Promise((resolve, reject) => {
            if(card_number && card_number.length > 0) {
                this.getCreditCards().then((cards:any) => {

                    for(let card of cards) {
                        let sPrefix = card.prefixes.split(',');
                        for(let prefix of sPrefix) {
                            if(card_number.substring(0, prefix.length) == prefix)
                                resolve(card);
                        }
                    }
                    reject("Número do Cartão está inválido");
                })
            }
            else reject("Número do Cartão está inválido");
        })
    }

    getAcceptedBrands() {
        return new Promise((resolve, reject) => {
            this.http.get(ENV.appUrl + 'nfe-agro/plans/cc-accepted-brands')
                .subscribe((data:any) => resolve(data.data),
                    err => reject(err));
        });
    }
}
