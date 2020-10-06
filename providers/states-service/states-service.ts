import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class StatesServiceProvider {

    constructor(public http: HttpClient) {}

    /**
     * get states
     */
    public getStates() {

        return new Promise((resolve, reject) => {
            this.getLocalStates().subscribe(
                response => resolve(response),
                error => reject(error)
            );
        });
    }

    /**
     *
     */
    public getLocalStates() {
        return this.http.get('./assets/data/states.json');
    };
}
