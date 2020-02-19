'use strict';
const DATA = {
    whichSite: [
        'landing',
        'multiPage',
        'onlineStore',
    ],
    price: [
        4000,
        8000,
        26000,
    ],
    desktopTemplates: [
        50,
        40,
        30,
    ],
    adapt: 20,
    mobileTemplates: 15,
    editable: 10,
    metrikaYandex: [
        500,
        1000,
        2000,
    ],
    analyticsGoogle: [
        850,
        1350,
        3000,
    ],
    sendOrder: 500,
    deadlineDay: [
        [
            2,
            7,
        ],
        [
            3,
            10,
        ],
        [
            7,
            14,
        ],
    ],
    deadlinePercent: [
        20,
        17,
        15,
    ],
};

const startButton = document.querySelector('.start-button'),
      firstScreen = document.querySelector('.first-screen'),
      mainForm = document.querySelector('.main-form'),
      formCalculate = document.querySelector('.form-calculate'),
      endButton = document.querySelector('.end-button'),
      total = document.querySelector('.total'),
      fastRange = document.querySelector('.fast-range'),
      totalPriceSum = document.querySelector('.total_price__sum');

function showElement(elem) {
    elem.style.display = '';
}
function hideElement(elem) {
    elem.style.display = 'none';
}
function disableElem(elem) {
    elem.disabled = true;
    elem.checked = false;
}
function enableElem(elem) {
    elem.disabled = false;
}
function priceCalculation(el, data) {
    let result = 0,
        index = data.whichSite.indexOf(el.form.querySelector('[name="whichSite"]:checked').value);
    const elements = el.form.elements,
          options = [],
          mobileTemplates = el.form.querySelector('#mobileTemplates');

    if ('whichSite' === el.name) {
        for (const item of elements) {
            if ('checkbox' === item.type) {
                item.checked = false;
            }
            if ('mobileTemplates' === item.id) {
                disableElem(item);
            }
        }
        hideElement(fastRange);
    }

    for (const item of elements) {
        if ('whichSite' === item.name && item.checked) {
            index = data.whichSite.indexOf(item.value);
        } else if (item.classList.contains('calc-handler') && item.checked) {
            options.push(item.value);
        }
        if ('adapt' === item.id) {
            if (item.checked) {
                enableElem(mobileTemplates);
            } else {
                disableElem(mobileTemplates);
            }
        }
    }

    options.forEach(function(key) {
        if ('number' === typeof data[key]) {
            if ('sendOrder' === key) {
                result += data[key];
            } else {
                result += data.price[index] * data[key] / 100;
            }
        } else {
            if ('desktopTemplates' === key) {
                result += data.price[index] * data[key][index] / 100;
            } else {
                result += data[key][index];
            }
        }
        
    });
    
    result += data.price[index];

    totalPriceSum.textContent = result;
}
function handlerCallBackForm(event) {
    const target = event.target;
    
    if (target.classList.contains('want-faster')) {
        const isChecked = target.checked ? showElement(fastRange) : hideElement(fastRange);
    }
    
    if (target.classList.contains('calc-handler')) {
        priceCalculation(target, DATA);
    }
}


startButton.addEventListener('click', function(event) {
    showElement(mainForm);
    hideElement(firstScreen);
});

endButton.addEventListener('click', function(event) {
    for (const elem of formCalculate.elements) {
        if (elem.tagName.toLowerCase() === 'fieldset') {
            hideElement(elem);
        }
    }

    showElement(total);

});

formCalculate.addEventListener('change', handlerCallBackForm);