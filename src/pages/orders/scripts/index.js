import '../../../styles/index.scss';

const itemsActive = document.querySelector('.coming-up');
const itemNoActive = document.querySelector('.previous');

let local = JSON.parse(localStorage.getItem('orders'));

class Checkout {
    #orders;
    #checkoutTime;
    #restaurant;
    constructor(orders, checkoutTime, restaurant) {
        this.#orders = orders;
        this.#checkoutTime = checkoutTime;
        this.#restaurant = restaurant;
    }
    isOrderFinished() {
        if (this.getCheckoutTime() <= 60) {
            return true;
        }
        return false;
    }
    getRestaurant() {
        if (typeof this.#restaurant.restaurant === 'string') {
            return this.#restaurant.restaurant;
        } else  {
            throw Error('Error');
        }
    }
    getCheckoutTime() {
        let dataNext = new Date();
        let data = new Date(this.#checkoutTime);
        if (dataNext.getTime() > data.getTime()) {
            return Math.floor((dataNext.getTime() - data.getTime())/(1000*60));
        } else {
            throw Error('Error');
        }
    }
    getFormattedDate() {
        let Data = new Date(this.#checkoutTime);
        let Year = Data.getFullYear();
        let Month = Data.getMonth();
        let Day = Data.getDate();
        let ruMonth = '';
        switch (Month)
        {
            case 0: ruMonth="января"; break;
            case 1: ruMonth="февраля"; break;
            case 2: ruMonth="марта"; break;
            case 3: ruMonth="апреля"; break;
            case 4: ruMonth="мае"; break;
            case 5: ruMonth="июня"; break;
            case 6: ruMonth="июля"; break;
            case 7: ruMonth="августа"; break;
            case 8: ruMonth="сентября"; break;
            case 9: ruMonth="октября"; break;
            case 10: ruMonth="ноября"; break;
            case 11: ruMonth="декабря"; break;
        }
        return `${Day} ${ruMonth} ${Year}`;
    }
    getFormattedTime() {
        return `${new Date(this.#checkoutTime).getHours()}:${new Date(this.#checkoutTime).getMinutes()} ${new Date(this.#checkoutTime).getHours() >13? "AM":"PM"}`;
    }
    getOrders() {
        const orders = [];
        this.#orders.forEach( item => {
            if (item.id > 0 && item.price > 0 && item.count > 0 && item.title.length > 5){
                orders.push(item);
            }else {
                throw Error('Error');
            }
        });
        return orders;
    }
    getCheckoutTimePercent() {
        let b = new Date().getTime() - new Date(this.#checkoutTime).getTime();
        let result = Math.floor((b * 100) / (1000 * 60 * 60));
        return result;
    }
}

let active = (local !== null)? local.map((item)=> new Checkout(item.orders, item.checkout, item.restaurant)): [];


function renderActive(array) {
    let out = '';
    array.forEach(item => {
        if (item.isOrderFinished() === true) {
            out += `
                 <div class="coming-up__item coming-up-item">
                  <div class="coming-up-item__header">
                    <h4 class="h4">${item.getRestaurant()}</h4>
                    <div class="badge badge--orange">Доставка</div>
                  </div>
                  <div class="coming-up-info">
                    <img src="img/icons/clock.svg" alt="">
                    <div class="coming-up-info__content">
                      <div>Заказ будет доставлен через</div>
                      <div class="coming-up-info__title">${60 - item.getCheckoutTime()} мин</div>
                    </div>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-bar__line" style="width: ${item.getCheckoutTimePercent()}%"></div>
                    <div class="progress-bar__overlay">
                      <div class="progress-bar__item progress-bar__item--first"></div>
                      <div class="progress-bar__item progress-bar__item--sec"></div>
                      <div class="progress-bar__item progress-bar__item--third"></div>
                    </div>
                  </div>
                </div>
            `;
        }
    });    
    itemsActive.innerHTML = out;
}


function show () {
    local.forEach(item => {
        const stop = Date.parse(item.checkout) + 3600000;
        const start = Date.parse(item.checkout);
        if(start !== stop) {
            console.log('rend');
            renderActive(active);
        }else {
            console.log('norend');
            renderNoActive(active);
            clearInterval(show);
        }
    });
}



function renderNoActive(array) {
    let out = '';
    let out2 = '';
    array.forEach(item => {
        if (item.isOrderFinished() === false) {
            item.getOrders().forEach(it => {
                out2 += `
                    <li class="previous-item-dishes__item">
                      <span class="previous-item-dishes__quantity">${it.count}</span>
                      ${it.title}
                    </li>
               `;
            });
            out += `
                <div class="previous__item previous-item">
                  <div class="previous-item__header">
                    <h4 class="h4">${item.getRestaurant()}</h4>
                    <div class="badge badge--green">Выполнен</div>
                  </div>
        
                  <div class="previous-item-info">
                    <div class="previous-item-info__date">${item.getFormattedDate()}</div>
                    <div class="previous-item-info__time">${item.getFormattedTime()}</div>
                  </div>
        
                  <ul class="previous-item-dishes">
                         ${out2}
                  </ul>
                </div>
           `;
        }
        out2 = '';
    });
    itemNoActive.innerHTML = out;
}

setInterval(show, 100);
renderActive(active);
renderNoActive(active);
