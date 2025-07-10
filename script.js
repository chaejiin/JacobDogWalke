'use strict';

const tinderContainer = document.querySelector('.tinder');
const tinderCardsContainer = document.querySelector('.tinder--cards');
const nope = document.getElementById('nope');
const love = document.getElementById('love');
const resetBtn = document.getElementById('reset');

// Dados dos serviços
const cardsData = [
  {
    title: "Passeios Personalizados",
    description: "R$100/hora — Solo ou em grupo. Roteiro adaptado para cada cãozinho.",
    img: "./img/IMG-20241007-WA0044.jpg"
  },
  {
    title: "Hospedagem (Em breve)",
    description: "R$95/noite — Para seu cãozinho dormir seguro e confortável.",
    img: "./img/20250613_091328.jpg"
  },
  {
    title: "Pet Sitter (Em breve)",
    description: "R$80 — Visitas em casa para cuidar, trocar água e alimentar.",
    img: "./img/hosp.jpg"
  }
];

// Inicializa os cards visuais
function initCards() {
  const newCards = document.querySelectorAll('.tinder--card:not(.removed)');

  newCards.forEach((card, index) => {
    card.style.zIndex = newCards.length - index;
    card.style.transform = `scale(${(20 - index) / 20}) translateY(-${30 * index}px)`;
    card.style.opacity = (10 - index) / 10;
  });

  tinderContainer.classList.add('loaded');
}

// Cria os eventos de swipe nos cards
function attachSwipeEvents() {
  const cards = document.querySelectorAll('.tinder--card:not(.removed)');

  cards.forEach((el) => {
    const hammertime = new Hammer(el);

    hammertime.on('pan', function (event) {
      el.classList.add('moving');
      if (event.deltaX === 0) return;

      tinderContainer.classList.toggle('tinder_love', event.deltaX > 0);
      tinderContainer.classList.toggle('tinder_nope', event.deltaX < 0);

      const xMulti = event.deltaX * 0.03;
      const yMulti = event.deltaY / 80;
      const rotate = xMulti * yMulti;

      el.style.transform = `translate(${event.deltaX}px, ${event.deltaY}px) rotate(${rotate}deg)`;
    });

    hammertime.on('panend', function (event) {
      el.classList.remove('moving');
      tinderContainer.classList.remove('tinder_love');
      tinderContainer.classList.remove('tinder_nope');

      const moveOutWidth = document.body.clientWidth;
      const keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

      if (keep) {
        el.style.transform = '';
      } else {
        const endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
        const toX = event.deltaX > 0 ? endX : -endX;
        const endY = Math.abs(event.velocityY) * moveOutWidth;
        const toY = event.deltaY > 0 ? endY : -endY;
        const xMulti = event.deltaX * 0.03;
        const yMulti = event.deltaY / 80;
        const rotate = xMulti * yMulti;

        el.style.transform = `translate(${toX}px, ${toY + event.deltaY}px) rotate(${rotate}deg)`;
        el.classList.add('removed');
        initCards();
      }
    });
  });
}

// Cria função para botões like/nope
function createButtonListener(love) {
  return function (event) {
    const cards = document.querySelectorAll('.tinder--card:not(.removed)');
    const moveOutWidth = document.body.clientWidth * 1.5;

    if (!cards.length) return false;

    const card = cards[0];
    card.classList.add('removed');

    if (love) {
      card.style.transform = `translate(${moveOutWidth}px, -100px) rotate(-30deg)`;
    } else {
      card.style.transform = `translate(-${moveOutWidth}px, -100px) rotate(30deg)`;
    }

    initCards();
    event.preventDefault();
  };
}

// Reseta os cards
function resetCards() {
  // Remove todos os cartões atuais
  document.querySelectorAll('.tinder--card').forEach(card => card.remove());

  // Recria os cartões iniciais
  cardsData.forEach(data => {
    const card = document.createElement('div');
    card.classList.add('tinder--card');
    card.style.backgroundImage = `url('${data.img}')`;

    card.innerHTML = `
      <div class="tinder--card-content">
        <h3>${data.title}</h3>
        <p>${data.description}</p>
      </div>
    `;

    tinderCardsContainer.appendChild(card);
  });

  initCards();
  attachSwipeEvents();
}

// Eventos principais
nope.addEventListener('click', createButtonListener(false));
love.addEventListener('click', createButtonListener(true));
resetBtn.addEventListener('click', resetCards);

// Inicialização
initCards();
attachSwipeEvents();
