import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment';
import {UtilitiesServiceProvider} from "../utilities-service/utilities-service";
import {CreditCardProvider} from "../credit-card/credit-card";

@Injectable()
export class ValidationServiceProvider {

    validations:any = [];

    constructor(public http: HttpClient,
                public utilitiesCtrl: UtilitiesServiceProvider,
                public creditCardService: CreditCardProvider) {}

    /**
     * Validate CPF and CNPJ
     * @param strCPF
     */
    checkCNPJ(strCPF:string) {
        if(strCPF) {
            let check_cpf = strCPF;
            strCPF = check_cpf.replace('-', '').replace('.', '').replace('.', '').replace('', '');
            if(strCPF.length <= 11) {
                if(strCPF) {
                    var sum;
                    var leftover;
                    sum = 0;
                    if (strCPF == "00000000000") return false;

                    for (let i=1; i<=9; i++) sum = sum + parseInt(strCPF.substring(i-1, i)) * (11 - i);
                    leftover = (sum * 10) % 11;

                    if ((leftover == 10) || (leftover == 11))  leftover = 0;
                    if (leftover != parseInt(strCPF.substring(9, 10)) ) return false;

                    sum = 0;
                    for (let i = 1; i <= 10; i++) sum = sum + parseInt(strCPF.substring(i-1, i)) * (12 - i);
                    leftover = (sum * 10) % 11;

                    if ((leftover == 10) || (leftover == 11))  leftover = 0;
                    if (leftover != parseInt(strCPF.substring(10, 11) ) ) return false;
                    return true;
                }
                else
                    return false;
            }
            else {
                let cnpj = strCPF;
                cnpj = cnpj.replace(/[^\d]+/g,'');

                if(cnpj == '') return false;

                if (cnpj.length != 14)
                    return false;

                // Elimina CNPJs invalidos conhecidos
                if (cnpj == "00000000000000" ||
                    cnpj == "11111111111111" ||
                    cnpj == "22222222222222" ||
                    cnpj == "33333333333333" ||
                    cnpj == "44444444444444" ||
                    cnpj == "55555555555555" ||
                    cnpj == "66666666666666" ||
                    cnpj == "77777777777777" ||
                    cnpj == "88888888888888" ||
                    cnpj == "99999999999999")
                    return false;
                // Valida DVs
                let tamanho = cnpj.length - 2
                let numeros = cnpj.substring(0,tamanho);
                let digitos = cnpj.substring(tamanho);
                let soma = 0;
                let pos = tamanho - 7;

                for (let i = tamanho; i >= 1; i--) {
                    soma = soma + +numeros.charAt(tamanho - i) * pos--;
                    if (pos < 2)
                        pos = 9;
                }

                let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                if (resultado != +(digitos.charAt(0)))
                    return false;

                tamanho = tamanho + 1;
                numeros = cnpj.substring(0,tamanho);
                soma = 0;
                pos = tamanho - 7;
                for (let i = tamanho; i >= 1; i--) {
                    soma += +(numeros.charAt(tamanho - i)) * pos--;
                    if (pos < 2)
                        pos = 9;
                }
                resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                if (resultado != +digitos.charAt(1))
                    return false;

                return true;
            }
        }
        else
            return false;
    }

    /**
     * Validate E-mail
     * @param email
     */
    validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    /**
     * Validate date
     * @param date
     * @param format
     */
    validateDate(date, format) {
        moment.locale('pt-br');
        try {
            if(date.length == 10 || date.length == 16 || date.length == 7) {
                let validate = moment(date, format);
                if(validate.isValid())
                    return true;
                else
                    return false;
            }
            else
                return false;
        }
        catch(e) {
            return false;
        }
    }

    /**
     * Verify if object is null
     * @param obj
     */
    objIsNull(obj:any = {}) {
        return Object.keys(obj).length === 0
    }

    async validateCreditCard(card_number) {
        let cards = [];

        await this.creditCardService.getCreditCards().then((data:any) => cards = data);

        let cardType = -1;

        for(let i = 0; i < cards.length; i++) {
            let splitted_prefix = cards[i].prefixes.split(',');
            for(let prefix of splitted_prefix) {
                if(card_number.substring(0, prefix.length) == prefix) {
                    cardType = i;
                    break;
                }
            }
            if(cardType != -1) break;
        }

        if (cardType == -1) { return false; } // card type not found

        card_number = card_number.replace(/[\s-]/g, ""); // remove spaces and dashes
        if (card_number.length == 0) { return false; } // no length

        let cardNo = card_number;
        let cardexp = /^[0-9]{13,19}$/;
        if (!cardexp.exec(cardNo)) { return false; } // has chars or wrong length

        cardNo = cardNo.replace(/\D/g, ""); // strip down to digits

        if (cards[cardType].checkdigit) {
            let checksum = 0;
            let mychar = "";
            let j = 1;

            let calc;
            for (let i = cardNo.length - 1; i >= 0; i--) {
                calc = Number(cardNo.charAt(i)) * j;
                if (calc > 9) {
                    checksum = checksum + 1;
                    calc = calc - 10;
                }
                checksum = checksum + calc;
                if (j == 1) { j = 2 } else { j = 1 };
            }

            if (checksum % 10 != 0) { return false; } // not mod10
        }

        let lengthValid = false;
        let prefixValid = false;
        let prefix:any = cards[cardType].prefixes.split(",");
        let lengths:any = cards[cardType].lengths.split(",");
        for (let i = 0; i < prefix.length; i++) {
            let exp = new RegExp("^" + prefix[i]);
            if (exp.test(cardNo)) prefixValid = true;
        }
        if (!prefixValid) { return false; } // invalid prefix

        for (let j = 0; j < lengths.length; j++) {
            if (cardNo.length == lengths[j]) lengthValid = true;
        }
        if (!lengthValid) { return false; } // wrong length

        return true;
    }

    validateExpirationDate(expiration_date = null) {
        if(!expiration_date || expiration_date.length != 7) return false;

        moment.locale('pt-br');

        let today = moment(moment().format('MM/YYYY'), 'MM/YYYY');
        let expDate = moment(expiration_date, 'MM/YYYY');

        if(expDate.diff(today, 'months', true) > 0)
            return true;
        return false;
    }

    validatePhone(phone) {
        return phone && (phone.length == 15 || phone.length == 14);
    }
}
