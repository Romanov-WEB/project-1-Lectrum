import '../../../styles/index.scss';

import dominosArray from './data/dominos.json';
import kfcArray from './data/kfc.json';
import macArray from './data/mac.json';

const tabsContent = document.querySelector('.tabs__content');
const tabItems = document.querySelectorAll('.featured__item');
const mcDonald = document.querySelector('#McDonald');
const DominoPizza = document.querySelector('#DominoPizza');
const KFC = document.querySelector('#KFC');
const basket = document.querySelector('.icon-button__badge');
const basketBtn = document.querySelector('#basketBtn');
const benExert = document.querySelector('#benExert');
const drawerOrder = document.querySelector('.order');
const btnLabel = document.querySelector('#btnLabel');

const idProduct = new Set();
const restaurant = {restaurant: null};

class Dish {
    #count;
    constructor(array) {
        const { id, price, title, img, count } = array;
        this.id = id;
        this.price = price;
        this.title = title;
        this.img = img;
        this.#count = count;
    }
    getCount() {
        return  this.#count++;
    }
    setCount() {
        this.#count --;
        if (this.#count < 0) {
            return this.#count = 0;
        }
        return this.#count;
    }
    showCount(){
        return this.#count;
    }
}

let orders = dominosArray.map((item)=> new Dish(item));
restaurant.restaurant = 'Domino’s Pizza';




function activeAdd(dom, index) {
    dom.forEach(item => item.classList.remove('active'));
    dom[index].classList.add('active');
}


function renderDrawer() {
    let items ='';
    const title = document.querySelector('.subtitle');
    const delivery = document.querySelector('[data-delivery-price="20"]');
    let sum = +delivery.getAttribute('data-delivery-price');
    const header = document.querySelector('#header');

    header.textContent = restaurant.restaurant;
    delivery.textContent = `${sum} грн`;
    title.textContent = `(${idProduct.size} ${'наименования'})`;
    for (let item of idProduct) {
        items += `
          <div class="order__item order-item">
            <img class="order-item__image" src="${item.img}" alt="">
            <span class="order-item__quantity">${item.showCount()}X</span>
            <div class="order-item__info">
              <h3 class="order-item__title h3">${item.title}</h3>
              <div class="order-item__price">${item.price + sum}</div>
            </div>
            <button class="icon-button icon-button--red"><img src="img/icons/delete.svg" alt=""></button>
          </div>
        `;
    }
    drawerOrder.innerHTML = items;
}


function render(array) {
    tabsContent.innerHTML = ' ';
    array.forEach( item => {
        tabsContent.insertAdjacentHTML('beforeend',`
            <div class="dish">
                <img class="dish__image" src="${item.img}" alt="">
                <div class="dish__title">${item.title}</div>
                <div class="dish__info">
                    <div class="dish__price">149 грн</div>
                    <div class="counter">
                        <button style="display: none" data-id="${item.id}" 
                        class="counter__button counter__button--decrease"></button>
                        <span class="counter__number"></span>
                        <button class="counter__button counter__button--increase"></button>
                    </div>
                </div>
            </div>`);
    });
    basketAdd();
}

function coutAdd() {
    const increase = document.querySelectorAll('.counter__button--increase');
    const decrease = document.querySelectorAll('.counter__button--decrease');
    const counterNumber = document.querySelectorAll('.counter__number');

    increase.forEach((item, index) => {
        item.addEventListener('click', () => {
            orders[index].getCount();
            decrease[index].style.cssText = 'display: block';
            counterNumber[index].textContent = orders[index].showCount();
            idProduct.add(orders[index]);
            basketAdd();
        });
    });
}

function coutRemove() {
    const decrease = document.querySelectorAll('.counter__button--decrease');
    const counterNumber = document.querySelectorAll('.counter__number');

    decrease.forEach((item, index) => {
        item.addEventListener('click', () => {
            orders[index].setCount();
            counterNumber[index].textContent = orders[index].showCount();
            idProduct.add(orders[index]);
            if (orders[index].showCount() === 0) {
                decrease[index].style.cssText = 'display: none';
                counterNumber[index].textContent = ' ';
                idProduct.delete(orders[index]);
            }
            basketAdd();
        });
    });
}




function basketAdd() {
    basket.textContent = idProduct.size;
}

tabItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        idProduct.clear();
        activeAdd(tabItems, index);
        if (item === mcDonald) {
            orders = macArray.map((item)=> new Dish(item));
            restaurant.restaurant = 'McDonald’s';
        }
        if (item === KFC) {
            orders = kfcArray.map((item)=> new Dish(item));
            restaurant.restaurant = 'KFC';
        }
        if (item === DominoPizza) {
            orders = dominosArray.map((item)=> new Dish(item));
            restaurant.restaurant = 'Domino’s Pizza';
        }
        render(orders);
        renderDrawer();
        coutAdd();
        coutRemove();
    });
});



basketBtn.addEventListener('click', (e) => {
    e.preventDefault();
    renderDrawer();
    document.querySelector('.overlay').classList.add('visible');
});

benExert.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.overlay').classList.remove('visible');
});

btnLabel.addEventListener('click', () => {
    const orders = [];
    let local = JSON.parse(localStorage.getItem('orders'));
    for (let item of idProduct) {
        orders.push({
            id: item.id,
            price: item.price,
            title: item.title,
            count: item.showCount()
        });
    }
    const array = local || [];
    console.log(local);
    array.push({
        restaurant,
        checkout: new Date(),
        orders
    });
    localStorage.setItem('orders', JSON.stringify(array));
    window.location.href = 'orders.html';
});
activeAdd(tabItems, 0);
render(orders);
basketAdd();
renderDrawer();
coutAdd();
coutRemove();