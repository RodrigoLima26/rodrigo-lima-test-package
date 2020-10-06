import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ENV } from '@app/env';

@Injectable()
export class UserServiceProvider {

    constructor(public http: HttpClient,
                public storage: Storage) {
    }

    /**
     * Get auth user online
     * @return Promise promise
     */
    getUser() {
        return this.http.get(ENV.appUrl+'user');
    }

    /**
     * Get local auth user
     * @return Promise promise
     */
    getAuthUser() {
        return this.storage.get('auth_user');
    }

    /**
     * Set Auth user
     * @param user
     * @return Promise promise
     */
    setAuthUser(user: any) {
        return this.storage.set('auth_user', user);
    }

    /**
     * Attempt login w/ credentials
     * @param username
     * @param password
     * @param cnpj
     * @return Promise promise
     */
    attemptLogin(username: String, password: String, cnpj: String) {

        let q = new Promise((resolve, reject) => {

            this.http.post(ENV.authUrl+'login', {
                email: username,
                password: password,
                cnpj: cnpj
            }).subscribe(async (response:any) => {
                this.lastAttemptLogin(username, password, cnpj);
                this.setAuthUser(response.data);
                let user: any = response.data;
                ENV.appUrl = response.data.appUrl;
                resolve(user);
            }, err => reject(err));
        });
        return q;
    }

    /**
     *
     * @param username
     * @param password
     * @param cnpj
     */
    lastAttemptLogin(username: String, password: String, cnpj: String) {
        this.storage.set('last_login_attempt', {username: username, password: password, cnpj: cnpj});
    }

    /**
     *
     */
    getLastAttemptLogin() {
        return this.storage.get('last_login_attempt');
    }

    /**
     * Log out of session
     * @return Promise promise
     */
    logout() {

        let q = new Promise((resolve, reject) => {
            this.storage.clear();

            resolve(true);
        });
        return q;
    }

    recoverPassword(email, cnpj) {
        return new Promise((resolve, reject) => {
            this.http.post(`${ENV.authUrl}esqueci-senha`, {email: email, cnpj: cnpj})
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }

    changePassword(password) {
        return new Promise((resolve, reject) => {
            this.http.post(`${ENV.appUrl}auth/trocar-senha`, password)
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        })
    }
}
