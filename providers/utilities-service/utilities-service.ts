import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from 'ionic-angular';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import {FileChooser} from "@ionic-native/file-chooser";
import {File} from "@ionic-native/file";
import {FilePath} from "@ionic-native/file-path";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";

@Injectable()
export class UtilitiesServiceProvider {

    LOADING_MESSAGE:string          = "Aguarde...";
    SINGLE_BUTTON_MESSAGE:string    = "Entendi";

    constructor(public alertCtrl: AlertController,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public fileChooser: FileChooser,
                public file: File,
                private barcodeScanner: BarcodeScanner,
                public filePath: FilePath) {}

    question(title = null, message, danger=false, question=false, callback:any=false) {
        let buttons = []
        if(question) {
            buttons = [{
                text: 'Não',
                handler: ()=> callback ? callback(false, true) : false
            }, {
                text: 'Sim',
                handler: ()=> callback ? callback(true, false) : true
            }]
        }
        else {
            buttons = [{
                text: this.SINGLE_BUTTON_MESSAGE,
                role: 'close'
            }]
        }

        this.alertCtrl.create({
            title: title,
            message: message,
            cssClass: danger ? 'custom-alertDanger' : '',
            buttons: buttons,
            enableBackdropDismiss: false
        }).present()
    }

    loading(content:string = this.LOADING_MESSAGE) {
        return this.loadingCtrl.create({ content: content });
    }

    toast(message:string, duration = null) {
        duration = duration || 1500;
        this.toastCtrl.create({ message: message, duration: duration, showCloseButton: true, closeButtonText: 'Fechar' }).present();
    }

    formatDate(date = null, format_from = 'DD/MM/YYYY', format_to = 'YYYY-MM-DD') {
        moment.locale('pt-br');
        if(!date)
            return format_to == 'toDate' ? moment().toDate() : moment().format(format_to)
        else
            return format_to == 'toDate' ? moment(date, format_from).toDate() : moment(date, format_from).format(format_to)
    }

    randomString(length = 5, callback) {
        let result           = '';
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++)
            result += characters.charAt(Math.floor(Math.random() * charactersLength));

        setTimeout(() => {
            callback(result);
        }, 200)
    }

    order(array, param) {
        return array.sort((a, b) => {
            if(a[param] < b[param]) return -1;
            else if(a[param] > b[param]) return 1;
            else return 0;
        });
    }

    swal(type = 'success', title = '', message = '', question = null, callback:any = null, cClass:string = null) {
        let config:any = {
            title: title,
            html: message,
            type: type,
            reverseButtons: true,
        }
        if(question) {
            config.showCancelButton = true;
            config.cancelButtonText = 'Não';
            config.confirmButtonColor = '#00a65a';
            config.cancelButtonColor = '#F44336';
            config.confirmButtonText = 'Sim';
        }
        else {
            config.confirmButtonText = 'Entendi';
        }

        if(cClass) config.customClass = cClass;

        Swal.fire(config).then((result) => {
            if(question && result.value)
                callback(true, false);
            else if(question)
                callback(false, true);
        })
    }

    getFile(callback) {
        let fileObj:any = {}

        this.fileChooser.open()
            .then(uri => {
                (<any>window).FilePath.resolveNativePath(uri, (result) => {
                    this.convertFileToBase64(result, (res, err) => {
                        if(res) callback(res, false);
                        else callback(false, err);
                    })
                });
            }).catch(e => callback(false, e));
    }

    convertFileToBase64(uri, callback) {

        let splitted_result = uri.split('/');
        let file_name = splitted_result[splitted_result.length - 1]; // Get File Name

        let splitted_path = uri.split(`/${file_name}`);
        let file_path = splitted_path[0]; // Get File Path

        let splitted_file_extension = file_name.split('.');
        let file_extension = splitted_file_extension[splitted_file_extension.length - 1]; // Get File Extension

        let fileObj:any = {
            file_name: file_name,
            file_path: file_path,
            file_extension: file_extension
        };

        this.file.readAsDataURL(file_path, file_name).then((data) =>{
            fileObj.base64 = data;
            callback(fileObj, false)
        }).catch((err) => callback(false, err))
    }

    manipulateDate(quantity:any = 1, date = null, format = 'YYYY-MM-DD', key:string = 'days', operation = 'add') {
        moment.locale('pt-br');
        if(operation == 'add') {
            return date ?
                moment(date).add(quantity, key).format(format) :
                moment().add(quantity, key).format(format)
        }
        else {
            return date ?
                moment(date).subtract(quantity, 'days').format('YYYY-MM-DD') :
                moment().subtract(quantity, 'days').format('YYYY-MM-DD')
        }
    }

    generatePaginate(page:number, last_page:number) {
        return new Promise((resolve, reject) => {
            let flag = true;
            let seq = page;
            let sequence:any = [];

            if(page > 1 && page != last_page) {
                sequence.push(page - 1);
                sequence.push(page);
            }
            else if(page > 2 && page == last_page) {
                sequence.push(page - 2);
                sequence.push(page - 1);
                sequence.push(page);
            }
            else sequence.push(page);

            if(page != last_page) {
                while(flag) {
                    if(sequence.length < 3) {
                        if(seq > last_page) flag = false;
                        else {
                            seq++;
                            sequence.push(seq);
                        }
                    }
                    else flag = false;
                }
            }

            setTimeout(() => resolve(sequence), 500);
        })
    }

    errorMessage(err:any, message:string = 'Houve um erro ao realizar a ação') {
        if(err.status == 422)
            return err.error.errors;
        else if(err.status != 422)
            return err.error.error;
        else
            return message;
    }

    formatValue(value:any = null, size:number = 2, subs:any = ['.', ',']) {
        return value ? (parseFloat(value).toFixed(2)).replace(subs[0], subs[1]) : value;
    }

    readBarcode() {
        return new Promise((resolve, reject) => {
            this.barcodeScanner.scan()
                .then(barcodeData => resolve(barcodeData)).catch(err => reject(err));
        })
    }

    cloneObject(obj) {
        return Object.assign({}, obj);
    }
}
