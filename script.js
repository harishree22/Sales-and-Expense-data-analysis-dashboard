const fileInput = document.getElementById("fileInput");
const tableBody = document.getElementById("tableBody");

let barChart, pieChart;

fileInput.addEventListener("change", handleFile);

function handleFile(e) {
  const reader = new FileReader();
  reader.onload = () => processCSV(reader.result);
  reader.readAsText(e.target.files[0]);
}

function processCSV(data) {
  const rows = data.split("\n").slice(1);
  let amounts = [];
  let categoryData = {};

  tableBody.innerHTML = "";

  rows.forEach(row => {
    if (!row) return;
    const [date, category, amount] = row.split(",");
    const value = Number(amount);

    amounts.push(value);
    categoryData[category] = (categoryData[category] || 0) + value;

    tableBody.innerHTML += `
      <tr>
        <td>${date}</td>
        <td>${category}</td>
        <td>₹${value}</td>
      </tr>`;
  });

  updateCards(amounts);
  drawCharts(categoryData);
}

function updateCards(amounts) {
  const total = amounts.reduce((a,b)=>a+b,0);
  document.getElementById("total").innerText = `Total ₹${total}`;
  document.getElementById("average").innerText =
    `Average ₹${(total/amounts.length).toFixed(2)}`;
  document.getElementById("max").innerText =
    `Max ₹${Math.max(...amounts)}`;
}

function drawCharts(data) {
  const labels = Object.keys(data);
  const values = Object.values(data);

  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();

  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{ data: values }]
    }
  });

  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels,
      datasets: [{ data: values }]
    }
  });
}
