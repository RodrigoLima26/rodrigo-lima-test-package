import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";

@Injectable()
export class ConfigServiceProvider {

    constructor(public http: HttpClient,
                public storage: Storage) {}

    getConfigs() {
        return this.storage.get('config');
    }

    storeConfig(config) {
        return this.storage.set('config', config);
    }
}
