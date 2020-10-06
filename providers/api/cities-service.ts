import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';

@Injectable()
export class CitiesServiceProvider {

    constructor(public http: HttpClient) {}

    getCities(page:number = 1, q:string = "") {
        return new Promise((resolve, reject) => {
            this.http.get(`${ENV.appUrl}cidades?page=${page}&q=${q}`).subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }
}
