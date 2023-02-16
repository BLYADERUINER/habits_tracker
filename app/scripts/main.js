'use strict';
const HABBIT_KEY = 'HABBIT_KEY';
let habbits = [];

const nextDay = document.querySelector('.tracker__day-next');
const habbitForm = document.querySelector('.tracker__form');
const addButtonDays = habbitForm.querySelector('.tracker__button-add');
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



const renderMenu = (activeHabbit) => {
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



const renderHead = (activeHabbit) => {
  page.header.h1.innerText = activeHabbit.name;
  const progress = activeHabbit.days.length / activeHabbit.target > 1
    ? 100
    : activeHabbit.days.length / activeHabbit.target * 100;

  page.header.progressPercent.innerText = progress.toFixed(0) + '%';
  page.header.progressLine.setAttribute('style', `width: ${progress}%`)
};



const renderContent = (activeHabbit) => {
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



const rerender = (activeHabbitId) => {
  activeElement = activeHabbitId;
  const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);

  if (!activeHabbit) {
    return;
  }

  renderMenu(activeHabbit);
  renderHead(activeHabbit);
  renderContent(activeHabbit);
};



const addDays = (event) => {
  const data = new FormData(event.target);
  const comment = data.get('comment');

  event.target['comment'].classList.remove('tracker__input_error');

  if (!comment) {
    event.target['comment'].classList.add('tracker__input_error');
  }

  habbits = habbits.map(item => {
    if (item.id === activeElement) {
      return {
        ...item,
        days: item.days.concat([{ comment }])
      }
    }
    return item;
  });
  rerender(activeElement);
  event.target.reset();
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



habbitForm.addEventListener('submit', (event) => {
  event.preventDefault();

  addDays(event);
});



(() => {
  loadData();
  rerender(habbits[0].id);
})();
