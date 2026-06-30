const balance = document.getElementById('balance');
const list = document.getElementById('list');
const form = document.getElementById('tracker-form');
const text = document.getElementById('desc');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const editIdInput = document.getElementById('edit-id');
const submitBtn = document.getElementById('form-submit-btn');
const balanceCard = document.getElementById('balance-card');
const appContainer = document.getElementById('app-container');

const categoryColors = {
  'General': '#7f8c8d',
  'Food': '#f39c12',
  'Salary': '#2ecc71',
  'Rent': '#9b59b6',
  'Entertainment': '#3498db'
};

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let isDarkMode = localStorage.getItem('darkMode') === 'true';

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

// Handles both Creating and Updating transactions
function saveTransaction(e) {
  e.preventDefault();
  
  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please complete all fields');
    return;
  }

  const editId = editIdInput.value;

  if (editId) {
    // UPDATE EXISTNG: Find the item by ID and modify it
    transactions = transactions.map(t => t.id == editId ? {
      ...t,
      text: text.value,
      amount: +amount.value,
      cat: category.value
    } : t);
    
    // Reset form button status
    submitBtn.innerText = 'Add Transaction';
    submitBtn.style.background = '#2ecc71';
    editIdInput.value = '';
  } else {
    // CREATE NEW
    const transaction = {
      id: Date.now(),
      text: text.value,
      amount: +amount.value,
      cat: category.value
    };
    transactions.push(transaction);
  }
  
  init();
  updateLocalStorage();
  
  text.value = '';
  amount.value = '';
}

// Click item to load its current values back into form fields
function editTransaction(id) {
  const transactionToEdit = transactions.find(t => t.id === id);
  if (!transactionToEdit) return;

  text.value = transactionToEdit.text;
  amount.value = transactionToEdit.amount;
  category.value = transactionToEdit.cat;
  editIdInput.value = transactionToEdit.id; // Set hidden ID tracker

  submitBtn.innerText = 'Update Transaction';
  submitBtn.style.background = '#3498db'; // Change button blue during edit mode
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll smoothly back up to inputs
}

function addTransactionDOM(t) {
  const item = document.createElement('li');
  const isExpense = t.amount < 0;
  const dotColor = categoryColors[t.cat] || '#7f8c8d';

  item.style.padding = "12px";
  item.style.margin = "8px 0";
  item.style.borderRadius = "6px";
  item.style.background = isDarkMode ? "#2c3e50" : "#f8f9fa";
  item.style.color = isDarkMode ? "#fff" : "#000";
  item.style.display = "flex";
  item.style.justifyContent = "space-between";
  item.style.alignItems = "center";
  item.style.borderLeft = `6px solid ${dotColor}`;
  item.style.cursor = 'pointer';
  
  // Clicking the card fires edit, clicking X deletes
  item.setAttribute('onclick', `editTransaction(${t.id})`);

  item.innerHTML = `
    <div>
      <span style="font-weight:bold;">${t.text}</span> 
      <br>
      <small style="background:${dotColor}; color:white; padding:1px 5px; border-radius:3px; font-size:10px;">${t.cat}</small>
    </div>
    <div style="display: flex; align-items: center; gap: 15px;">
      <span style="color: ${isExpense ? '#e74c3c' : '#2ecc71'}; font-weight: bold;">
        ${isExpense ? '-' : '+'}$${Math.abs(t.amount)}
      </span>
      <button onclick="event.stopPropagation(); removeTransaction(${t.id})" style="background:none; border:none; color:#e74c3c; cursor:pointer; font-weight:bold; font-size:16px;">✕</button>
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
  
  if (total < 0) {
    balanceCard.style.backgroundColor = '#fadbd8';
    balanceCard.style.color = '#78281f';
  } else if (total > 0) {
    balanceCard.style.backgroundColor = '#d4efdf';
    balanceCard.style.color = '#145a32';
  } else {
    balanceCard.style.backgroundColor = isDarkMode ? '#34495e' : '#f1f2f6';
    balanceCard.style.color = isDarkMode ? '#fff' : '#000';
  }
  
  applyTheme();
}

form.addEventListener('submit', saveTransaction);
init();
