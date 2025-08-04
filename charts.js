import Chart from 'https://cdn.jsdelivr.net/npm/chart.js@4/auto/+esm';

export function pie(ctx, labels, data) {
  new Chart(ctx, {
    type: 'pie',
    data: { labels, datasets: [{ data, backgroundColor: ['#28a745', '#dc3545'] }] },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

export function bar(ctx, labels, data) {
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Заработок, ₽',
        data,
        backgroundColor: '#007bff'
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}