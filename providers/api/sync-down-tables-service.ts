import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BillingTypesServiceProvider} from "./billing-types-service";
import {PaymentPlanServiceProvider} from "./payment-plan-service";
import {PeopleServiceProvider} from "./people-service";
import {ProductServiceProvider} from "./product-service";
import {UtilitiesServiceProvider} from "../utilities-service/utilities-service";
import {OutputTypeServiceProvider} from "./output-type-service";
import {ActivityServiceProvider} from "./activity-service";
import {UnitsServiceProvider} from "./units-service";
import {CancelReasonsServiceProvider} from "./cancel-reasons-service";
import {AgendaServiceProvider} from "./agenda-service";
import {FormapagrecServiceProvider} from "./formapagrec-service";
import {SubstatusServiceProvider} from "./substatus-service";
import {PrioritiesServiceProvider} from "./priorities-service";
import {DepartmentsServiceProvider} from "./departments-service";

@Injectable()
export class SyncDownTablesServiceProvider {

    constructor(public http: HttpClient,
                public billingTypesService: BillingTypesServiceProvider,
                public paymentPlansService: PaymentPlanServiceProvider,
                public peopleService: PeopleServiceProvider,
                public productService: ProductServiceProvider,
                public utilities: UtilitiesServiceProvider,
                public formapagrecService: FormapagrecServiceProvider,
                public outputsCtrl: OutputTypeServiceProvider,
                public unitsCtrl: UnitsServiceProvider,
                public cancelReasonsService: CancelReasonsServiceProvider,
                public agendaService: AgendaServiceProvider,
                public substatusService: SubstatusServiceProvider,
                public prioritiesService: PrioritiesServiceProvider,
                public departmentsService: DepartmentsServiceProvider,
                public activitiesCtrl: ActivityServiceProvider) {}


    downloadTables() {
        this.downloadBillingTypes();
        this.downloadPaymentPlans();
        this.downloadPeople();
        this.downloadShippingCompany();
        this.downloadOutputTypes();
        this.downloadActivities();
        this.downloadUnits();
        this.downloadCancelReasons();
        this.downloadAgenda();
        this.downloadAgendaTypes();
        this.downloadFormaPagRec();
        this.downloadSubstatus();
        this.downloadDepartments();
        this.downloadPriorities();
    }

    /**
     *
     */
    downloadFormaPagRec() {
        let loading = this.utilities.loading('Baixando Formas de Pagamento...');
        loading.present();

        this.formapagrecService.getFormaPagRec().then(data => loading.dismiss()).catch(err => loading.dismiss());
    }

    /**
     *
     */
    downloadSubstatus() {
        let loading = this.utilities.loading('Baixando Formas de Pagamento...');
        loading.present();

        this.substatusService.getSubstatus().then(data => loading.dismiss()).catch(err => loading.dismiss());
    }

    /**
     *
     */
    downloadDepartments() {
        let loading = this.utilities.loading('Baixando Formas de Pagamento...');
        loading.present();

        this.departmentsService.getDepartments().then(data => loading.dismiss()).catch(err => loading.dismiss());
    }

    /**
     *
     */
    downloadPriorities() {
        let loading = this.utilities.loading('Baixando Formas de Pagamento...');
        loading.present();

        this.prioritiesService.getPriorities().then(data => loading.dismiss()).catch(err => loading.dismiss());
    }

    /**
     *
     */
    downloadAgendaTypes() {
        let loading = this.utilities.loading('Baixando Tipos de Agenda...');
        loading.present();

        this.agendaService.getAgendaTypes().then(data => loading.dismiss()).catch(err => loading.dismiss());
    }

    /**
     *
     */
    downloadAgenda() {
        let loading = this.utilities.loading('Baixando Agendas...');
        loading.present();

        this.agendaService.getAgendas().then(data => loading.dismiss()).catch(err => loading.dismiss());
    }

    /**
     *
     */
    downloadCancelReasons() {
        let loading = this.utilities.loading('Baixando Motivos de Cancelamento...');
        loading.present();

        this.cancelReasonsService.getCancelReasons().then(data => loading.dismiss()).catch(err => loading.dismiss());
    }

    /**
     *
     */
    downloadUnits() {
        let loading = this.utilities.loading('Baixando Unidades de Medida...');
        loading.present();

        this.unitsCtrl.getUnits()
            .then(data => loading.dismiss())
            .catch(err => loading.dismiss());
    }

    /**
     *
     */
    downloadActivities() {
        let loading = this.utilities.loading('Baixando Ramos de Atividade...');
        loading.present();

        this.activitiesCtrl.getActivities()
            .then(data => loading.dismiss())
            .catch(err => loading.dismiss());
    }

    /**
     *
     */
    downloadOutputTypes() {
        let loading = this.utilities.loading('Baixando Tipos de Saída...');
        loading.present();

        this.outputsCtrl.getOutputs()
            .then(data => loading.dismiss())
            .catch(err => loading.dismiss());
    }

    /**
     *
     */
    downloadShippingCompany() {
        let loading = this.utilities.loading('Baixando Transportadores...');
        loading.present();

        this.peopleService.getShippingCompany()
            .then(data => loading.dismiss())
            .catch(err => loading.dismiss());
    }

    /**
     *
     */
    downloadPeople() {
        let loading = this.utilities.loading('Baixando Clientes...');
        loading.present();

        this.peopleService.getPeople()
            .then(data => loading.dismiss())
            .catch(err => loading.dismiss());
    }

    /**
     *
     */
    downloadPaymentPlans() {
        let loading = this.utilities.loading('Baixando Planos de Pagamento...');
        loading.present();

        this.paymentPlansService.getPaymentPlans()
            .then(data => loading.dismiss())
            .catch(err => loading.dismiss());
    }

    /**
     *
     */
    downloadBillingTypes() {
        let loading = this.utilities.loading('Baixando tipos de cobrança...');
        loading.present();

        this.billingTypesService.getBillingTypes()
            .then(data => loading.dismiss())
            .catch(err => loading.dismiss());
    }
}
