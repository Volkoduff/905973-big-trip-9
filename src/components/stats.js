import {AbstractComponent} from './abstract-component';
import {getHumanFriendlyTime} from './utils';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export class Statistics extends AbstractComponent {
  constructor() {
    super();
    this._isReapeated = false;
  }

  createCharts(events) {
    this.events = events;
    this._getDueDates();

    this._createMoneyChart();
    this._createTransportChart();
    this._createDurationChart();
  }

  hide() {
    this.getElement().classList.add(`visually-hidden`);
  }

  show() {
    this.getElement().classList.remove(`visually-hidden`);
  }

  _getDueDates() {
    this._eventTypeSumm = {
      accumulator(amount) {
        this.sum += amount;
      },
      durationAccumulator(amount) {
        this.durationSum += amount;
      },
      counter() {
        this.count++;
      },
    };
    this.eventMoneySums = [];
    this.events
      .map((event) => {
        this.currentEvent = event.event;
        this.currentAmount = event.price;
        this.currentStartTime = event.startTime;
        this.currentEndTime = event.endTime;
        this._increaseSumIfRepeated();
        if (!this._isReapeated) {
          this._getNewDateInDates();
        }
      });
    this._isReapeated = false;
    this.eventMoneySums.sort((a, b) => b.sum - a.sum);
  }

  _getNewDateInDates() {
    const newAmount = Object.create(this._eventTypeSumm);
    newAmount.type = this.currentEvent;
    newAmount.sum = this.currentAmount;
    newAmount.durationSum = Math.abs((this.currentStartTime - this.currentEndTime));
    newAmount.count = 1;
    this.eventMoneySums.push(newAmount);
  }

  _increaseSumIfRepeated() {
    for (let eventSum of this.eventMoneySums) {
      if (eventSum.type === this.currentEvent) {
        eventSum.accumulator(this.currentAmount);
        eventSum.durationAccumulator(Math.abs((this.currentStartTime - this.currentEndTime)));
        eventSum.counter();
        this._isReapeated = true;
        break;
      } else {
        this._isReapeated = false;
      }
    }
  }

  _getEventLabels(labelsPerSum) {
    return labelsPerSum.map((el) => el.type.toUpperCase());
  }

  _getEventSums(labelsPerSum) {
    return labelsPerSum.map((el) => el.sum);
  }

  _getEventIterations(labelsPerSum) {
    return labelsPerSum.map((el) => el.count);
  }

  _getSpentTime(labelsPerSum) {
    return labelsPerSum.map((el) => el.durationSum);
  }

  _createMoneyChart() {
    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    if (this.moneyChart !== undefined) {
      this.moneyChart.destroy();
    }

    this.moneyChart = new Chart(moneyCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._getEventLabels(this.eventMoneySums),
        datasets: [{
          data: this._getEventSums(this.eventMoneySums),
          backgroundColor: `#ffd054`,
          borderWidth: 1,
          borderColor: `#424242`,
        }]
      },
      options: {
        plugins: {
          datalabels: {
            formatter(value) {
              return `€ ${value}`;
            },
            align: `end`,
            clamp: true,
            backgroundColor: `#078ff0d4`,
            borderWidth: 1,
            borderColor: `#424242`,
            font: {
              size: 17
            },
            color: `#fff`
          }
        },
        scales: {
          yAxes: [{
            barPercentage: 0.6,
            maxBarThickness: 40,
            minBarLength: 20,
            ticks: {
              opacity: 1,
              padding: 20,
              fontColor: `#424242`,
              fontStyle: `bold`,
              fontSize: 16,
              beginAtZero: false,
              display: true,
            },
            gridLines: {
              display: false,
              drawBorder: true,
              borderColor: `#424242`,
            }
          }],
          xAxes: [{
            ticks: {
              display: false
            },
            gridLines: {
              display: false,
              drawBorder: true
            }
          }]
        },
        tooltips: {
          enabled: false,
        },
        title: {
          display: true,
          text: `Money`,
          fontSize: 25,
        },
        legend: {
          display: false
        },
        layout: {
          padding: {
            left: 120,
          }
        }
      }
    });
  }

  _createTransportChart() {
    const transportCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    if (this.eventIterationsChart !== undefined) {
      this.eventIterationsChart.destroy();
    }
    this.eventIterationsChart = new Chart(transportCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._getEventLabels(this.eventMoneySums),
        datasets: [{
          data: this._getEventIterations(this.eventMoneySums),
          backgroundColor: `#ffd054`,
          borderWidth: 1,
          borderColor: `#424242`,
        }]
      },
      options: {
        plugins: {
          datalabels: {
            formatter(value) {
              return `${value}x`;
            },
            align: `end`,
            clamp: true,
            backgroundColor: `#078ff0d4`,
            borderWidth: 1,
            borderColor: `#424242`,
            font: {
              size: 17
            },
            color: `#fff`
          }
        },
        scales: {
          yAxes: [{
            barPercentage: 0.6,
            maxBarThickness: 40,
            minBarLength: 20,
            ticks: {
              padding: 20,
              fontColor: `#424242`,
              fontSize: 16,
              beginAtZero: false,
              display: true,
            },
            gridLines: {
              display: false,
              drawBorder: true
            }
          }],
          xAxes: [{
            ticks: {
              display: false

            },
            gridLines: {
              display: false,
              drawBorder: true
            }
          }]
        },
        title: {
          display: true,
          text: `Transport`,
          fontSize: 25,
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        },
        layout: {
          padding: {
            left: 120,
          }
        }
      }
    });
  }

  _createDurationChart() {
    if (this.durationChart !== undefined) {
      this.durationChart.destroy();
    }
    const timeSpentCtx = this.getElement().querySelector(`.statistics__chart--time`);
    this.durationChart = new Chart(timeSpentCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._getEventLabels(this.eventMoneySums),
        datasets: [{
          data: this._getSpentTime(this.eventMoneySums),
          backgroundColor: `#ffd054`,
          borderWidth: 1,
          borderColor: `#424242`,
        }]
      },
      options: {
        plugins: {
          datalabels: {
            formatter(value) {
              return getHumanFriendlyTime(value);
            },
            align: `end`,
            clamp: true,
            backgroundColor: `#078ff0d4`,
            borderWidth: 1,
            borderColor: `#424242`,
            font: {
              size: 17
            },
            color: `#fff`
          }
        },
        scales: {
          yAxes: [{
            barPercentage: 0.6,
            maxBarThickness: 40,
            minBarLength: 20,
            ticks: {
              padding: 20,
              fontColor: `#424242`,
              fontSize: 16,
              beginAtZero: false,
              display: true,
            },
            gridLines: {
              display: false,
              drawBorder: true
            }
          }],
          xAxes: [{
            ticks: {
              display: false

            },
            gridLines: {
              display: false,
              drawBorder: true
            }
          }]
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        },
        title: {
          display: true,
          text: `Time Spent`,
          fontSize: 25,
        },
        layout: {
          padding: {
            left: 120,
          }
        }
      }
    });
  }

  getTemplate() {
    return `<section class="statistics"><h2 class="visually-hidden">Trip statistics</h2>

          <div class="statistics__item statistics__item--money">
            <canvas class="statistics__chart  statistics__chart--money" height="300" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--transport">
            <canvas class="statistics__chart  statistics__chart--transport" height="300" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--time-spend">
            <canvas class="statistics__chart  statistics__chart--time" height="300" width="900"></canvas>
          </div>
        </section>`;
  }
}
