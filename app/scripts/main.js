'use strict';
const HABBIT_KEY = 'HABBIT_KEY';
let habbits = [];

const nextDay = document.querySelector('.tracker__day-next');
const habbitForm = document.querySelector('.tracker__form');
const addButtonDays = habbitForm.querySelector('.tracker__button-add');
const openPopupButton = document.querySelector('.menu__button-add');
const popup = document.querySelector('.popup');
const closePopupButton = popup.querySelector('.popup__button-close');
const popupForm = popup.querySelector('.popup__form');
let activeElement;


const page = {
  menu: document.querySelector('.menu__list'),
  header: {
    h1: document.querySelector('.header__title'),
    progressPercent: document.querySelector('.header__status'),
    progressLine: document.querySelector('.header__line_active')
  },
  content: {
    daysContainer : document.querySelector('.tracker__list'),
    nextDay: nextDay.querySelector('.tracker__day'),
    text: document.querySelector('.tracker__text')
  },
  popup: {
    index: document.getElementById('popup'),
    iconField: document.querySelector('.popup__form input[name="icon"]')
  }
};




const loadData = () => {
  const habbitsString = localStorage.getItem(HABBIT_KEY);
  const habbitArray = JSON.parse(habbitsString);

  if (Array.isArray(habbitArray)) {
    habbits = habbitArray;
  }
};



const saveData = () => {
  localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
};



function renderMenu (activeHabbit) {
  for (const habbit of habbits) {
    const existed = document.querySelector(`[habbit-id="${habbit.id}"]`);

    if (!existed) {
      const element = document.createElement('button');

      element.setAttribute('habbit-id', habbit.id);
      element.classList.add('menu__button-item');
      element.addEventListener('click', () => rerender(habbit.id));
      element.innerHTML = `<img class="menu__icon" src="./image/${habbit.icon}.svg" alt="${habbit.name}" />`;
      if (activeHabbit.id === habbit.id) {
        element.classList.add('menu__button-item_active');
      }
      page.menu.appendChild(element);
      continue;
    }


    if (activeHabbit.id === habbit.id) {
      existed.classList.add('menu__button-item_active');
    } else {
      existed.classList.remove('menu__button-item_active');
    }
  };
};



function renderHead (activeHabbit) {
  page.header.h1.innerText = activeHabbit.name;
  const progress = activeHabbit.days.length / activeHabbit.target > 1
    ? 100
    : activeHabbit.days.length / activeHabbit.target * 100;

  page.header.progressPercent.innerText = progress.toFixed(0) + '%';
  page.header.progressLine.setAttribute('style', `width: ${progress}%`)
};



function renderContent (activeHabbit) {
  page.content.daysContainer.innerHTML = '';

  for (const index in activeHabbit.days) {
    const element = document.createElement('li');


    element.classList.add('tracker__item');
    element.innerHTML = `
      <h2 class="tracker__day">День ${Number(index) + 1}</h2>
      <p class="tracker__text">${activeHabbit.days[index].comment}</p>
      <button class="tracker__button-delete" onclick="deleteDay(${index})" type="button"></button>`;


    page.content.daysContainer.appendChild(element);
  };


  page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;
};



function rerender (activeHabbitId) {
  activeElement = activeHabbitId;
  const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);

  if (!activeHabbit) {
    return;
  }


  document.location.replace(document.location.pathname + '#' + activeHabbitId);

  renderMenu(activeHabbit);
  renderHead(activeHabbit);
  renderContent(activeHabbit);
};



function addDays (event) {
  const data = validateAndGetFormData(event.target, ['comment']);
  if (!data) {
    return;
  }


  // const data = new FormData(event.target);
  // const comment = data.get('comment');

  // event.target['comment'].classList.remove('tracker__input_error');

  // if (!comment) {
  //   event.target['comment'].classList.add('tracker__input_error');
  // }

  habbits = habbits.map(item => {
    if (item.id === activeElement) {
      return {
        ...item,
        days: item.days.concat([{ comment: data.comment }])
      }
    }
    return item;
  });
  rerender(activeElement);
  resetForm(event.target, ['comment']);
  saveData();
};



function deleteDay (index) {
  habbits = habbits.map(habbit => {
    if (habbit.id === activeElement) {
      habbit.days.splice(index, 1);
      return {
        ...habbit,
        days: habbit.days
      };
    }
    return habbit;
  });
  rerender(activeElement);
  saveData();
};


function setIcon (context, icon) {
  page.popup.iconField.value = icon;
  const activeIcon = document.querySelector('.popup__icon-button.popup__icon-button_active');
  activeIcon.classList.remove('popup__icon-button_active');
  context.classList.add('popup__icon-button_active');
};


function validateAndGetFormData (form, fields) {
  const formData = new FormData(form);
  const res = {};
  for (const field of fields) {
    const fieldValue = formData.get(field);
    form[field].classList.remove('popup__input_error');
    if (!fieldValue) {
      form[field].classList.add('popup__input_error');
    }
    res[field] = fieldValue;
  };

  let isValid = true;

  for (const field of fields) {
    if(!res[field]) {
      isValid = false;
    }
  };

  if (!isValid) {
    return;
  }

  return res;
};


function resetForm (form, fields) {
  for (const field of fields) {
    form[field].value = '';
  };
};


function addHabbit (event) {
  const data = validateAndGetFormData(event.target, ['name', 'icon', 'target']);
  if (!data) {
    return;
  }


  const maxId = habbits.reduce((acc, habbit) => acc > habbit.id ? acc : habbit.id, 0);
  habbits.push({
    id: maxId + 1,
    name: data.name,
    target: data.target,
    icon: data.icon,
    days: []
  });


  resetForm(event.target, ['name', 'target']);
  saveData();
  rerender(maxId + 1);
};


habbitForm.addEventListener('submit', (event) => {
  event.preventDefault();

  addDays(event);
});


popupForm.addEventListener('submit', (event) => {
  event.preventDefault();

  addHabbit(event);
  closePopup();
})

// function togglePopup () {
//   if (page.popup.index.classList.contains('popup_active')) {
//     page.popup.index.classList.remove('popup_active');
//   } else {
//     page.popup.index.classList.add('popup_active');
//   }
// };


const openedPopup = function () {
  popup.classList.add('popup_active');
};

const closePopup = function () {
  popup.classList.remove('popup_active');
};


openPopupButton.addEventListener('click', openedPopup);
closePopupButton.addEventListener('click', closePopup);


(() => {
  loadData();
  const hashId = Number(document.location.hash.replace('#', ''));
  const urlHabbit = habbits.find(habbit => habbit.id === hashId);
  if (urlHabbit) {
    rerender(urlHabbit.id);
  } else {
    rerender(habbits[0].id);
  }
})();
