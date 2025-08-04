import { getAll, add, del } from '../db.js';

const cats = ['Пособие','Зарплата','Помощь','Другое'];

export default async function (root) {
  root.innerHTML = `
    <section>
      <h2>Добавить расход</h2>
      <form id="form">
        <input name="amount" type="number" placeholder="Сумма" required />
        <input name="date" type="date" required />
        <input name="target" placeholder="Куда потрачено" required />
        <select name="category" required>
          ${cats.map(c=>`<option value="${c}">${c}</option>`)}
          <option value="custom">Своя категория…</option>
        </select>
        <input name="custom" placeholder="Своя категория" style="display:none" />
        <button>Добавить</button>
      </form>
    </section>
    <section>
      <h2>История расходов</h2>
      <ul id="list"></ul>
    </section>
  `;

  const form = root.querySelector('#form');
  const list = root.querySelector('#list');

  form.category.addEventListener('change', e => {
    form.custom.style.display = e.target.value === 'custom' ? 'block' : 'none';
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const { amount, date, target, category, custom } = form.elements;
    await add('expenses', {
      amount: +amount.value,
      date: date.value,
      target: target.value,
      category: category.value === 'custom' ? custom.value : category.value
    });
    form.reset();
    refresh();
  });

  async function refresh() {
    const items = await getAll('expenses');
    list.innerHTML = items.map(i=>`
      <li>${i.amount}₽ – ${i.target} (${i.category}, ${i.date})
        <button onclick="del('expenses',${i.id}).then(refresh)">✖</button>
      </li>`).join('');
  }
  refresh();
}