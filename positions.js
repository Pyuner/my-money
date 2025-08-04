import { getAll, add, del } from '../../db.js';

export default async function (root) {
  root.innerHTML = `
    <section>
      <h2>Добавить позицию</h2>
      <form id="form">
        <input name="name" placeholder="Название" required />
        <input name="holes" type="number" placeholder="Отверстий на 1к" required />
        <input name="sets" type="number" placeholder="Комплектов" required />
        <input name="price" type="number" placeholder="Цена за 1к" required />
        <button>Добавить</button>
      </form>
    </section>
    <section>
      <h2>Позиции (А-Я)</h2>
      <ul id="list"></ul>
    </section>
  `;

  const form = root.querySelector('#form');
  const list = root.querySelector('#list');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const { name, holes, sets, price } = form.elements;
    await add('positions', {
      name: name.value.trim(),
      holes: +holes.value,
      sets: +sets.value,
      price: +price.value
    });
    form.reset();
    refresh();
  });

  async function refresh() {
    const items = await getAll('positions');
    items.sort((a,b)=>a.name.localeCompare(b.name));
    list.innerHTML = items.map(i=>`
      <li>${i.name} | ${i.holes} отв/1к | ${i.sets} компл | ${i.holes*i.price}₽
        <button onclick="del('positions',${i.id}).then(refresh)">✖</button>
      </li>`).join('');
  }
  refresh();
}