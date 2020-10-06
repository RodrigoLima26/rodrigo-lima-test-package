import { HttpClient } from '@angular/common/http';
import {ElementRef, Injectable} from '@angular/core';
import { Chart } from 'chart.js';

@Injectable()
export class ChartBuilderServiceProvider {

    colors:any = [
        "rgba(0, 0, 0, 0.4)",
        "rgba(0, 166, 90, 0.4)",
        "rgba(244, 67, 54, 0.4)",
        "rgba(0, 139, 210, 0.4)",
        "rgba(243, 156, 18, 0.4)",
        "rgba(89, 85, 110, 0.4)",
        "rgba(255, 255, 0, 0.4)"
    ];

    constructor(public http: HttpClient) {}

    setChart(chartCanvas: ElementRef, data:any, type:string = 'line', size:number = 0) {
        if(type == 'multiplelines') {

            return new Chart(chartCanvas.nativeElement, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: data.data
                },
                options: {
                    tooltips: {
                        callbacks: {
                            label: (tooltipItem, data) => {
                                return this.formatValue(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index], size)
                            }
                        }
                    }
                }
            });
        }
        else {
            return new Chart(chartCanvas.nativeElement, {
                type: type,
                data: {
                    labels: data.labels,
                    datasets: [
                        {
                            label: data.datasets_label,
                            lineTension: 0.1,
                            backgroundColor: [
                                "rgba(0, 0, 0, 0.4)",
                                "rgba(0, 166, 90, 0.4)",
                                "rgba(244, 67, 54, 0.4)",
                                "rgba(0, 139, 210, 0.4)",
                                "rgba(243, 156, 18, 0.4)",
                                "rgba(89, 85, 110, 0.4)",
                                "rgba(255, 255, 0, 0.4)"
                            ],
                            borderColor: [
                                "rgba(0, 0, 0, 0.4)",
                                "rgba(0, 166, 90, 0.4)",
                                "rgba(244, 67, 54, 0.4)",
                                "rgba(0, 139, 210, 0.4)",
                                "rgba(243, 156, 18, 0.4)",
                                "rgba(89, 85, 110, 0.4)",
                                "rgba(255, 255, 0, 0.4)"
                            ],
                            pointBorderColor: this.returnColors(type),
                            pointBackgroundColor: "#fff",
                            pointBorderWidth: 10,
                            pointHoverRadius: 15,
                            pointHoverBackgroundColor: "rgba(75,192,192,1)",
                            pointHoverBorderColor: "rgba(220,220,220,1)",
                            pointHoverBorderWidth: 7,
                            pointRadius: 6,
                            data: data.data,
                            spanGaps: false,
                            fill: false
                        }
                    ]
                },
                options: {
                    tooltips: {
                        callbacks: {
                            label: (tooltipItem, data) => {
                                return this.formatValue(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index], size)
                            }
                        }
                    }
                }
            });
        }
    }

    returnColors(type:string) {
        return type == 'line' ? this.colors[0] : this.colors;
    }

    formatValue(value:any, size:number) {
        return value ? (parseFloat(value).toFixed(size)).replace('.', ',') : '';
    }
}
