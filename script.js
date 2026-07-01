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

// Vivid theme colors mapped to shopping categories
const categoryColors = {
  'Clothes': '#9b59b6',       // Purple
  'Food': '#e67e22',          // Orange
  'Electronics': '#3498db',   // Blue
  'Salary': '#2ecc71',        // Green (Add cash)
  'General': '#7f8c8d'        // Gray
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
    if(document.getElementById('theme-btn')) document.getElementById('theme-btn').innerText = 'Light Mode ☀️';
  } else {
    document.body.style.backgroundColor = '#ffffff';
    appContainer.style.color = '#000000';
    if(document.getElementById('theme-btn')) document.getElementById('theme-btn').innerText = 'Dark Mode 🌙';
  }
}

// Math solver supporting operations (+, -, *, /)
function calculateAmount(inputVal) {
  try {
    let sanitized = inputVal.replace(/[^0-9+\-*/.]/g, '');
    if (!sanitized) return 0;
    
    let result = Function(`"use strict"; return (${sanitized})`)();
    
    // AUTOMATIC SUBTRACTION: Everything subtracts unless it's designated as "Salary/Add Money"
    if (category.value !== 'Salary') {
      result = -Math.abs(result); 
    } else {
      result = Math.abs(result);
    }
    
    return isNaN(result) || !isFinite(result) ? null : result;
  } catch (error) {
    return null;
  }
}

function saveTransaction(e) {
  e.preventDefault();
  
  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please complete all fields');
    return;
  }

  const finalAmount = calculateAmount(amount.value);
  if (finalAmount === null) {
    alert('Invalid math format!');
    return;
  }

  const editId = editIdInput.value;

  if (editId) {
    transactions = transactions.map(t => t.id == editId ? {
      ...t,
      text: text.value,
      amount: finalAmount,
      cat: category.value
    } : t);
    if(submitBtn) {
      submitBtn.innerText = 'Buy Item (Subtract)';
      submitBtn.style.background = '#e74c3c';
    }
    editIdInput.value = '';
  } else {
    const transaction = {
      id: Date.now(),
      text: text.value,
      amount: finalAmount,
      cat: category.value
    };
    transactions.push(transaction);
  }
  
  init();
  updateLocalStorage();
  text.value = '';
  amount.value = '';
}

function editTransaction(id) {
  const transactionToEdit = transactions.find(t => t.id === id);
  if (!transactionToEdit) return;

  text.value = transactionToEdit.text;
  amount.value = Math.abs(transactionToEdit.amount); 
  category.value = transactionToEdit.cat;
  editIdInput.value = transactionToEdit.id;

  if(submitBtn) {
    submitBtn.innerText = 'Update Item';
    submitBtn.style.background = '#3498db';
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function addTransactionDOM(t) {
  const item = document.createElement('li');
  const isExpense = t.amount < 0;
  const itemColor = categoryColors[t.cat] || '#7f8c8d';

  item.style.padding = "14px";
  item.style.margin = "10px 0";
  item.style.borderRadius = "8px";
  item.style.background = isDarkMode ? "#2c3e50" : "#f8f9fa";
  item.style.color = isDarkMode ? "#fff" : "#000";
  item.style.display = "flex";
  item.style.justifyContent = "space-between";
  item.style.alignItems = "center";
  item.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
  item.style.borderLeft = `8px solid ${itemColor}`; // Beautiful live color border tag
  item.style.cursor = 'pointer';
  item.setAttribute('onclick', `editTransaction(${t.id})`);

  item.innerHTML = `
    <div>
      <span style="font-weight:bold; font-size:16px;">${t.text}</span> 
      <br>
      <span style="background:${itemColor}; color:white; padding:2px 6px; border-radius:4px; font-size:11px; display:inline-block; margin-top:4px;">${t.cat}</span>
    </div>
    <div style="display: flex; align-items: center; gap: 15px;">
      <span style="color: ${isExpense ? '#e74c3c' : '#2ecc71'}; font-weight: bold; font-size:16px;">
        ${isExpense ? '-' : '+'}$${Math.abs(t.amount).toFixed(2)}
      </span>
      <button onclick="event.stopPropagation(); removeTransaction(${t.id})" style="background:none; border:none; color:#e74c3c; cursor:pointer; font-weight:bold; font-size:18px;">✕</button>
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
  if (confirm("Clear your shopping basket and reset balance to $10,000?")) {
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
  
  const startingBalance = 10000;
  const transactionTotal = transactions.reduce((acc, t) => acc + t.amount, 0);
  const total = startingBalance + transactionTotal;
  
  balance.innerText = total.toFixed(2);
  
  // Real-time card colors changing depending on wallet status
  if (total <= 0) {
    balanceCard.style.backgroundColor = '#fadbd8'; // Red tint (No money left)
    balanceCard.style.color = '#78281f';
  } else if (total < 4000) {
    balanceCard.style.backgroundColor = '#fdebd0'; // Orange tint (Low budget warning)
    balanceCard.style.color = '#7e5109';
  } else {
    balanceCard.style.backgroundColor = '#d4efdf'; // Safe green tint
    balanceCard.style.color = '#145a32';
  }
  
  // Listen to option changes to change button color live
  if(category) {
    category.onchange = () => {
        if(category.value === 'Salary') {
            submitBtn.innerText = 'Add Money (Deposit)';
            submitBtn.style.background = '#2ecc71';
        } else {
            submitBtn.innerText = 'Buy Item (Subtract)';
            submitBtn.style.background = '#e74c3c';
        }
    };
  }

  applyTheme();
}

form.addEventListener('submit', saveTransaction);
init();
