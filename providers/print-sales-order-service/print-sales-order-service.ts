import { Injectable } from '@angular/core';
import {PrinterProvider} from "../printer/printer";
import {AlertController, Events, LoadingController, ToastController} from "ionic-angular";
import {AppVersion} from "@ionic-native/app-version";
import {UtilitiesServiceProvider} from "../utilities-service/utilities-service";
import EscPosEncoder from "esc-pos-encoder-ionic";
import {BluetoothSerial} from "@ionic-native/bluetooth-serial";

@Injectable()
export class PrintSalesOrderServiceProvider {

    receipt: any;
    inputData: any = {};
    currentHeight:any = 0;
    func:any = "";

    constructor(public printer: PrinterProvider,
                private alertCtrl: AlertController,
                private loadCtrl: LoadingController,
                public events: Events,
                private appVersion: AppVersion,
                public utilities: UtilitiesServiceProvider,
                private toastCtrl: ToastController) {}


    confirmPrint(order, data:any = null, user, config, i:number = 1) {

        return new Promise((resolve, reject) => {
            let loading = this.utilities.loading();
            loading.present();

            console.log(config);
            console.log(config.TIPOIMPRESSAO == 'nativa');

            if(config.TIPOIMPRESSAO == 'nativa' && !config.EMITIR_NFCE)
                this.printManual(order, data, user, config)
            else
                this.prepareToPrint(data, config);

            setTimeout(() => {

                loading.dismiss();

                i++;

                if(i <= (config.QUANTIDADE_DE_VIAS ? config.QUANTIDADE_DE_VIAS : 1)) {

                    this.utilities.swal('question', `Deseja Imprimir a ${i}ª via?`, null, true, (res, err) => {
                        if(res) {
                            loading.dismiss();
                            this.confirmPrint(order, data, user, config, i);
                            this.printer.disconnectBluetooth();
                        }
                        else {
                            this.printer.disconnectBluetooth();
                            loading.dismiss();
                            resolve(config);
                        }
                    })
                }
                else {
                    loading.dismiss();
                    this.printer.disconnectBluetooth();
                    resolve(config);
                }
            }, 2500);
        })

    }

    calcHeight(height, divisible) {

        console.log('enter on calcHeight')

        return new Promise((resolve, reject) => {

            if(this.currentHeight != 0) return resolve(this.currentHeight);
            else {
                while(this.currentHeight == 0) {

                    if(height % divisible == 0) {
                        console.log('Correct Height: '+height);
                        this.currentHeight = height;
                        setTimeout(() => {
                            return resolve(this.currentHeight);
                        }, 100)
                    }
                    else {
                        console.log('Not the correct height: '+height);
                        height++;
                    }
                }
            }

        })
    }

    showToast(data) {
        let toast = this.toastCtrl.create({
            duration: 3000,
            message: data,
            position: 'bottom',
        });
        toast.present();
    }

    print(device, data) {

        console.log('Enter on print');

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.printer.printData(data).then((printStatus) => {
                    console.log('Success on Print');
                    console.log(printStatus);
                    resolve(printStatus);
                }).catch((error) => {

                    console.log('Error on print');
                    console.log(error);
                    reject(error)
                });
            }, 500)
        })
    }

    prepareToPrint(data, config, func:any = '') {

        console.log(data);
        console.log(config);

        this.func = func;

        let encoder = new EscPosEncoder();
        let result = encoder.initialize();

        console.log('Enter on promisse in prepare to print');

        console.log(config.EMITIR_NFCE);

        if(config.EMITIR_NFCE && config.EMITIR_NFCE != undefined) {
            console.log('Caiu no atob');
            this.mountAlertBt(atob(data.base64), config)
        }
        else {
            let img = new Image();
            img.src = `data:image/jpeg;base64,${data.base64}`;

            img.onload = () => {

                console.log('Load Image');

                this.calcHeight(img.height, 8).then((imgHeight) => {

                    console.log('after calc height');

                    result.codepage('windows1251')
                        .image(img, 584, imgHeight, 'atkinson')
                        .newline()
                        .newline()
                        .newline()
                        .newline()

                    this.mountAlertBt(result.encode(), config)
                });
            }
        }
    }

    mountAlertBt(data, config, i = 1) {
        console.log('Enter on Mount Alert');
        this.receipt = data;

        console.log('Enter on While');
        console.log('Vias: '+config.QUANTIDADE_DE_VIAS);

        console.log('Via: '+i);

        console.log('Pre Bluetooth connect');

        let bt_serial = new BluetoothSerial();
        this.printer = new PrinterProvider(bt_serial);

        this.printer.connectBluetooth(config.IMPRESSORA_PADRAO).subscribe((status) => {

            console.log('Connected to Bluetooth');

            this.print(config.IMPRESSORA_PADRAO, this.receipt).then(async (data:any) => {
                console.log(data)
            }).catch(async (err) => {
                this.utilities.toast(`Houve um erro ao imprimir a via.`);
            });
        }, (error) => {
            console.log('Error on connect to bluetooth');
            console.log(error);
            this.utilities.toast('Erro ao conectar ao bluetooth');
        });
    }

    printManual(order, data:any = null, user, config) {
        let encoder = new EscPosEncoder();
        let result = encoder.initialize();

        console.log(user);
        console.log(order);

        result
            .codepage('windows1251');

        // Header
        result.align('center')
            .bold(true)
            .line(`${this.noSpecialChars(user.empresa.NOMEFANTASIA)}`)
            .bold(false)
            .line(`${this.noSpecialChars(user.empresa.RAZAOSOCIAL)}`)
            .line(`CNPJ: ${user.empresa.CNPJ} | IE: ${user.empresa.INSCRICAOESTADUAL}`)
            .line(`${this.noSpecialChars((user.empresa.ENDERECOEMPRESA))}. ${user.empresa.NUMERO} - ${this.noSpecialChars(user.empresa.cidade.NOME)}/${this.noSpecialChars(user.empresa.cidade.CODIGOESTADO)}`)
            .line(`TEL: ${user.empresa.TELEFONE} | CELULAR: ${user.empresa.FAX}`)
            .line('-------------------------')

        // Body
        result.align('center')
            .bold(true)
            .line(`PDV: #${order.NUMERODOCUMENTOSAIDA}`)
            .bold(false)
            .align('left')
            .line(`DATA: ${this.utilities.formatDate(order.DT_SAIDA, 'YYYY-MM-DD HH:mm:ss', 'DD/MM/YYYY HH:mm:ss')}`)
            .line(`VENDEDOR: ${this.noSpecialChars(user.pessoa.RAZAOSOCIAL)}`)
            .bold(true)
            .line(`CLIENTE: ${this.noSpecialChars(order.cliente.RAZAOSOCIAL)}`)
            .bold(false)
            .line(`DADOS ADIC.: ${order.DADOSADICIONAIS ? order.DADOSADICIONAIS : ""}`)
            .align('center')
            .line('-------------------------')

        // Products
        let i = 1;

        for(let product of order.produtos) {
            result.align('left')
                .line(`${product.CODIGOPRODUTO} - ${this.noSpecialChars(product.produto.DESCRICAORESUMIDA)}`)
            if(product.OBSERVACAO) {
                result.align('left')
                    .size('small')
                    .line(`Obs: ${this.noSpecialChars(product.OBSERVACAO)}`)
                    .size('normal');
            }
            result.align('right')
                .line(`${this.returnPrice(product.QUANTIDADE)} x R$ ${this.returnPrice(product.VLR_UNITARIO)} = R$ ${this.returnPrice(product.VLR_TOTAL)}`)
            i++;
        }

        setTimeout(() => {
            result.newline()
                .align('center')
                .text('-------------------------')
                .newline()
                .align('right')
                .line(`PRODUTOS: R$ ${this.returnPrice(order.VLR_PRODUTOS)}`)
                .line(`SERVICOS: R$ ${this.returnPrice(order.VLR_SERVICOS)}`)
                .line(`ACRESCIMO: R$ ${this.returnPrice(order.VLR_OUTROS)}`)
                .line(`DESCONTO: R$ ${this.returnPrice(order.VLR_DESCONTO)}`)
                .line(`TOTAL: R$ ${this.returnPrice(order.VLR_TOTAL)}`)
                .newline()
                .newline()
                .newline()
                .newline()
                .align('center')
                .line('-------------------------')
                .line(order.cliente.RAZAOSOCIAL)
                .line(this.utilities.formatDate(null, null, 'DD/MM/YYYY HH:mm'));

            result.newline()
                  .newline();

            if(order.nfce) {
                result.line(`NFCE: ${order.nfce.NUMERONOTAFISCALCONSUMIDOR}`)
                      .line(order.nfce.CHAVE_NFE);
            }

            result.size('small')
                .line('SiEmpresarial @ F5Software')
                .line('f5sg.com.br')
                .size('normal')
                .newline()
                .newline()
                .newline()

            this.mountAlertBt(result.encode(), config)
        }, 200);
    }

    returnPrice(price) {
        if(!price) return "0,00";
        else return (parseFloat(price).toFixed(2)).replace('.', ',');
    }

    noSpecialChars(string) {
        if(!string) return "";
        let translate = {à: 'a', á: 'a', â: 'a', ã: 'a', ä: 'a', å: 'a', æ: 'a', ç: 'c', è: 'e', é: 'e', ê: 'e', ë: 'e', ì: 'i', í: 'i', î: 'i', ï: 'i', ð: 'd', ñ: 'n', ò: 'o', ó: 'o', ô: 'o', õ: 'o', ö: 'o', ø: 'o', ù: 'u', ú: 'u', û: 'u', ü: 'u', ý: 'y', þ: 'b', ÿ: 'y', ŕ: 'r', À: 'A', Á: 'A', Â: 'A', Ã: 'A', Ä: 'A', Å: 'A', Æ: 'A', Ç: 'C', È: 'E', É: 'E', Ê: 'E', Ë: 'E', Ì: 'I', Í: 'I', Î: 'I', Ï: 'I', Ð: 'D', Ñ: 'N', Ò: 'O', Ó: 'O', Ô: 'O', Õ: 'O', Ö: 'O', Ø: 'O', Ù: 'U', Ú: 'U', Û: 'U', Ü: 'U', Ý: 'Y', Þ: 'B', Ÿ: 'Y', Ŕ: 'R',}
        let translate_re = /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþßàáâãäåæçèéêëìíîïðñòóôõöøùúûýýþÿŕŕÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÝÝÞŸŔŔ]/gim;
        return string.replace(translate_re, (match) => translate[match]);
    }
}
