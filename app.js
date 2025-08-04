import { getAll, add, del } from './db.js';
import { pie, bar } from './charts.js';

const nav = document.querySelector('nav');
const content = document.getElementById('content');

nav.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    [...nav.children].forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    render(e.target.dataset.tab);
  }
});

function route(t) { return `./tabs/${t}.js`; }

async function render(name) {
  const mod = await import(route(name));
  content.innerHTML = '';
  await mod.default(content);
}

render('home');