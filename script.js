const balance = document.getElementById('balance');
const list = document.getElementById('list');
const form = document.getElementById('tracker-form');
const text = document.getElementById('desc');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const balanceCard = document.getElementById('balance-card');
const appContainer = document.getElementById('app-container');

// Map categories to specific live accent colors
const categoryColors = {
  'General': '#7f8c8d',       // Gray
  'Food': '#f39c12',          // Orange
  'Salary': '#2ecc71',        // Green
  'Rent': '#9b59b6',          // Purple
  'Entertainment': '#3498db'  // Blue
};

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Toggle between Dark and Light Mode live
function toggleTheme() {
  isDarkMode = !isDarkMode;
  localStorage.setItem('darkMode', isDarkMode);
  applyTheme();
}

function applyTheme() {
  if (isDarkMode) {
    document.body.style.backgroundColor = '#1a1a1a';
    appContainer.style.color = '#ffffff';
    document.getElementById('theme-btn').innerText = 'Light Mode ☀️';
  } else {
    document.body.style.backgroundColor = '#ffffff';
    appContainer.style.color = '#000000';
    document.getElementById('theme-btn').innerText = 'Dark Mode 🌙';
  }
}

function addTransaction(e) {
  e.preventDefault();
  
  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value,
    cat: category.value
  };
  
  transactions.push(transaction);
  init();
  updateLocalStorage();
  
  text.value = '';
  amount.value = '';
}

function addTransactionDOM(t) {
  const item = document.createElement('li');
  const isExpense = t.amount < 0;
  const dotColor = categoryColors[t.cat] || '#7f8c8d';

  // Apply responsive card styles directly via JS
  item.style.padding = "12px";
  item.style.margin = "8px 0";
  item.style.borderRadius = "6px";
  item.style.background = isDarkMode ? "#2c3e50" : "#f8f9fa";
  item.style.color = isDarkMode ? "#fff" : "#000";
  item.style.display = "flex";
  item.style.justifyContent = "space-between";
  item.style.alignItems = "center";
  item.style.borderLeft = `6px solid ${dotColor}`; // Color coded by category

  item.innerHTML = `
    <div>
      <span style="font-weight:bold;">${t.text}</span> 
      <br>
      <small style="color:#bdc3c7; background:${dotColor}; color:white; padding:1px 5px; border-radius:3px; font-size:10px;">${t.cat}</small>
    </div>
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="color: ${isExpense ? '#e74c3c' : '#2ecc71'}; font-weight: bold;">
        ${isExpense ? '-' : '+'}$${Math.abs(t.amount)}
      </span>
      <button onclick="removeTransaction(${t.id})" style="background:none; border:none; color:#e74c3c; cursor:pointer; font-weight:bold; font-size:16px;">✕</button>
    </div>
  `;
  list.appendChild(item);
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

function resetData() {
  if (confirm("Are you sure you want to delete all tracker logs?")) {
    transactions = [];
    updateLocalStorage();
    init();
  }
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  
  const total = transactions.reduce((acc, t) => acc + t.amount, 0);
  balance.innerText = total.toFixed(2);
  
  // Real-time Balance Box background colors based on total money
  if (total < 0) {
    balanceCard.style.backgroundColor = '#fadbd8'; // Red tint for debt
    balanceCard.style.color = '#78281f';
  } else if (total > 0) {
    balanceCard.style.backgroundColor = '#d4efdf'; // Green tint for profit
    balanceCard.style.color = '#145a32';
  } else {
    balanceCard.style.backgroundColor = isDarkMode ? '#34495e' : '#f1f2f6';
    balanceCard.style.color = isDarkMode ? '#fff' : '#000';
  }
  
  applyTheme();
}

form.addEventListener('submit', addTransaction);
init();
