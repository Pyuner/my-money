export default function (root) {
  root.innerHTML = `
    <nav class="sub">
      <button data-work="positions">Позиции</button>
      <button data-work="log">Выработка</button>
    </nav>
    <div id="workContent"></div>
  `;

  const sub = root.querySelector('.sub');
  const wc = root.querySelector('#workContent');

  sub.addEventListener('click', e => {
    if (e.target.dataset.work) {
      [...sub.children].forEach(b=>b.classList.remove('active'));
      e.target.classList.add('active');
      import(`./work/${e.target.dataset.work}.js`).then(m=>m.default(wc));
    }
  });
  sub.firstElementChild.click();
}