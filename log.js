import { getAll, add } from '../../db.js';
import { bar } from '../../charts.js';

export default async function (root) {
  const y = new Date().getFullYear();
  root.innerHTML = `
    <section>
      <h2>Выработка ${y}</h2>
      <canvas id="bar"></canvas>
      <p>Год: ${y}</p>
    </section>
    <section>
      <h2>Добавить выработку</h2>
      <input type="date" id="date" />
      <div id="addForm" style="display:none">
        <select id="pos"></select>
        <input id="sets" type="number" placeholder="Комплектов" min="1" />
        <button id="save">Сохранить</button>
      </div>
      <ul id="dayList"></ul>
      <p id="dayTotal"></p>
    </section>
  `;

  const positions = await getAll('positions');
  const dateSel = root.querySelector('#date');
  const formDiv = root.querySelector('#addForm');
  const posSel = root.querySelector('#pos');
  const setsInp = root.querySelector('#sets');
  const saveBtn = root.querySelector('#save');
  const dayList = root.querySelector('#dayList');
  const dayTotal = root.querySelector('#dayTotal');

  posSel.innerHTML = positions.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');

  dateSel.addEventListener('change', loadDay);
  saveBtn.addEventListener('click', async () => {
    const posId = +posSel.value;
    const sets = +setsInp.value;
    const pos = positions.find(p=>p.id===posId);
    await add('worklog', { posId, sets, date: dateSel.value, earned: sets*pos.price });
    loadDay();
    refreshBar();
  });

  async function loadDay() {
    const d = dateSel.value;
    const logs = await getAll('worklog');
    const filtered = logs.filter(l=>l.date===d);
    dayList.innerHTML = filtered.map(l=>{
      const p = positions.find(p=>p.id===l.posId);
      return `<li>${p.name} | ${p.holes*l.sets} отв | ${l.sets} компл | ${l.earned}₽</li>`;
    }).join('');
    const total = filtered.reduce((a,b)=>a+b.earned,0);
    const totalSets = filtered.reduce((a,b)=>a+b.sets,0);
    const totalHoles = filtered.reduce((a,b)=>{
      const p = positions.find(p=>p.id===b.posId);
      return a + p.holes*b.sets;
    },0);
    dayTotal.textContent = `Итого: ${totalHoles} отв, ${totalSets} компл, ${total}₽`;
    formDiv.style.display = 'block';
  }

  async function refreshBar() {
    const logs = await getAll('worklog');
    const byMonth = Array(12).fill(0);
    logs.forEach(l=>{
      const m = new Date(l.date).getMonth();
      byMonth[m] += l.earned;
    });
    bar(root.querySelector('#bar'), ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'], byMonth);
  }
  refreshBar();
}