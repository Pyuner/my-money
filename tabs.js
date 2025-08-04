import { getAll } from '../db.js';
import { pie } from '../charts.js';

export default async function (root) {
  const [inc, exp] = await Promise.all([getAll('incomes'), getAll('expenses')]);
  const sum = arr => arr.reduce((a, b) => a + b.amount, 0);

  const totalInc = sum(inc);
  const totalExp = sum(exp);

  root.innerHTML = `
    <section>
      <h2>Доходы / Расходы</h2>
      <canvas id="pie"></canvas>
    </section>
    <section>
      <h2>Доходы</h2>
      <ul>${inc.map(i=>`<li>${i.amount}₽ – ${i.source} (${i.date})</li>`).join('')}</ul>
    </section>
    <section>
      <h2>Расходы</h2>
      <ul>${exp.map(e=>`<li>${e.amount}₽ – ${e.target} (${e.category}, ${e.date})</li>`).join('')}</ul>
    </section>
  `;
  pie(document.getElementById('pie'), ['Доходы', 'Расходы'], [totalInc, totalExp]);
}