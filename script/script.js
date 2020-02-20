'use strict';
const DAY_STRING = ['день', 'дня', 'дней'];
const ANSWER_STRING = ['нет', 'да'];
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
      totalPriceSum = document.querySelector('.total_price__sum'),
      adapt = document.getElementById('adapt'),
      mobileTemplates = document.getElementById('mobileTemplates'),
      typeSite = document.querySelector('.type-site'),
      maxDeadline = document.querySelector('.max-deadline'),
      rangeDeadline = document.querySelector('.range-deadline'),
      deadlineValue = document.querySelector('.deadline-value');

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
function declOfNum(n, titles, from) {
    return n + ' ' + titles[from ? n % 10 === 1 && n % 100 !== 11 ? 1 : 2 : n % 10 === 1 && n % 100 !== 11 ?
        0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
}
function renderTextContent(total, site, maxDay, minDay, formTag) {
    totalPriceSum.textContent = total;
    typeSite.textContent = site;
    maxDeadline.textContent = declOfNum(maxDay, DAY_STRING);
    rangeDeadline.min = minDay;
    rangeDeadline.max = maxDay;
    deadlineValue.textContent = declOfNum(rangeDeadline.value, DAY_STRING);

    const elements = formTag.elements;
    for (const i of elements) {
        if ('checkbox' === i.type && i.classList.contains('calc-handler')) {
            if (!i.classList.contains('css-check')) {
                i.closest('.switcher').querySelector('.checkbox-label').textContent = ANSWER_STRING[Number(i.checked)];
            }
        }
    }
}
function priceCalculation(el, data) {
    let result = 0,
        index = data.whichSite.indexOf(el.form.querySelector('[name="whichSite"]:checked').value),
        site = '',
        minDeadLineDay = data.deadlineDay[index][0],
        maxDeadLineDay = data.deadlineDay[index][1];
    const form = el.form,
          elements = form.elements,
          options = [],
          mobileTemplates = form.querySelector('#mobileTemplates');

    if ('whichSite' === el.name) {
        for (const item of elements) {
            if ('checkbox' === item.type) {
                item.checked = false;
            }
            if ('mobileTemplates' === item.id) {
                disableElem(item);
            }
        }
        site = el.dataset.site;
        hideElement(fastRange);
    }

    for (const item of elements) {
        if ('whichSite' === item.name && item.checked) {
            index = data.whichSite.indexOf(item.value);
            minDeadLineDay = data.deadlineDay[index][0];
            maxDeadLineDay = data.deadlineDay[index][1];
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

    renderTextContent(result, site, maxDeadLineDay, minDeadLineDay, form);
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