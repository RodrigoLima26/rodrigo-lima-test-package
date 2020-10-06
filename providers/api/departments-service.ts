import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from "@app/env";
import {Storage} from "@ionic/storage";

@Injectable()
export class DepartmentsServiceProvider {

    constructor(public http: HttpClient, public storage: Storage) {}

    getDepartments() {
        return new Promise((resolve, reject) => {
            this.http.get(`${ENV.appUrl}departamentos`)
                .subscribe((data:any) => {
                    this.storeDepartments(data.data);
                    resolve(data.data)
                }, err => reject(err));
        })
    }

    storeDepartments(departments) {
        this.storage.set('departments', departments);
    }

    getLocalDepartments() {
        return this.storage.get('departments');
    }
}
