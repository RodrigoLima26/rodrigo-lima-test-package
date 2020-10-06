import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import {Storage} from "@ionic/storage";
import {DashboardServiceProvider} from "./dashboard-service";
import {Events} from "ionic-angular";

@Injectable()
export class NotificationsServiceProvider {

    constructor(public http: HttpClient,
                public storage: Storage,
                public dashboardService: DashboardServiceProvider,
                public events: Events) {}

    getNotifications() {
        return new Promise((resolve, reject) => {
            this.http.get(ENV.appUrl + 'nfe-agro/notifications/all')
                .subscribe((data:any) => {
                        this.storeNotifications(data.data);
                        resolve(data.data)
                    }, err => reject(err));
        });
    }

    getUnreadNotifications() {
        return new Promise((resolve, reject) => {
            this.http.get(ENV.appUrl + 'nfe-agro/notifications/unread')
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        });
    }

    getReadNotifications() {
        return new Promise((resolve, reject) => {
            this.http.get(ENV.appUrl + 'nfe-agro/notifications/read')
                .subscribe((data:any) => resolve(data.data), err => reject(err));
        });
    }

    readNotification(notification, index, notifications:any) {
        return new Promise((resolve, reject) => {
            this.http.post(ENV.appUrl + `nfe-agro/notifications/${notification.ID_NOTIFICACAO}/read`, {})
                .subscribe((data:any) => {
                    notifications[index].leituras.push(data.data);
                    this.storeNotifications(notifications);
                    this.dashboardService.getLocalDashboard().then(async (data: any) => {
                        data.notifications--;
                        await this.dashboardService.storeDashboard(data);
                        this.events.publish('home:reloadDashboard');
                    });
                    resolve(data.data)
                }, err => reject(err));
        });
    }

    storeNotifications(notifications) {
        this.storage.set('notifications', notifications);
    }

    getLocalNotifications() {
        return this.storage.get('notifications');
    }
}
