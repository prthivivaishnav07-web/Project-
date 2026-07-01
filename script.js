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
const themeSelect = document.getElementById('theme-select');

// Color tags for item history entries
const categoryColors = {
  'Clothes': '#9b59b6',
  'Food': '#e67e22',
  'Electronics': '#3498db',
  'Salary': '#2ecc71',
  'General': '#7f8c8d'
};

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentTheme = localStorage.getItem('siteTheme') || 'white';

// Standard 4-Option Theme Configurations
function changeTheme() {
  currentTheme = themeSelect.value;
  localStorage.setItem('siteTheme', currentTheme);
  applyThemeStyles();
}

function applyThemeStyles() {
  themeSelect.value = currentTheme;
  
  if (currentTheme === 'white') {
    document.body.style.backgroundColor = '#ffffff';
    appContainer.style.backgroundColor = '#ffffff';
    appContainer.style.color = '#000000';
    appContainer.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
  } else if (currentTheme === 'grey') {
    document.body.style.backgroundColor = '#7f8c8d';
    appContainer.style.backgroundColor = '#b2bec3';
    appContainer.style.color = '#2d3436';
    appContainer.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
  } else if (currentTheme === 'black') {
    document.body.style.backgroundColor = '#111111';
    appContainer.style.backgroundColor = '#222222';
    appContainer.style.color = '#ffffff';
    appContainer.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
  } else if (currentTheme === 'blue') {
    document.body.style.backgroundColor = '#2c3e50';
    appContainer.style.backgroundColor = '#34495e';
    appContainer.style.color = '#ecf0f1';
    appContainer.style.boxShadow = '0 4px 15px rgba(52, 152, 219, 0.4)';
  }
  
  // Refresh entries to match dark/light contrast elements
  init();
}

function calculateAmount(inputVal) {
  try {
    let sanitized = inputVal.replace(/[^0-9+\-*/.]/g, '');
    if (!sanitized) return 0;
    
    let result = Function(`"use strict"; return (${sanitized})`)();
    
    // Auto-subtraction rule for spending
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
    alert('Please complete all standard fields.');
    return;
  }

  const finalAmount = calculateAmount(amount.value);
  if (finalAmount === null) {
    alert('Invalid numeric or calculation format.');
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
    submitBtn.innerText = 'Purchase Item (Subtract)';
    submitBtn.style.background = '#e74c3c';
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

  submitBtn.innerText = 'Modify Record';
  submitBtn.style.background = '#3498db';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function addTransactionDOM(t) {
  const item = document.createElement('li');
  const isExpense = t.amount < 0;
  const itemColor = categoryColors[t.cat] || '#7f8c8d';
  const darkBackgrounds = ['black', 'blue'];

  item.style.padding = "14px";
  item.style.margin = "10px 0";
  item.style.borderRadius = "6px";
  item.style.background = darkBackgrounds.includes(currentTheme) ? "#333333" : "#fdfefe";
  item.style.color = darkBackgrounds.includes(currentTheme) ? "#ffffff" : "#333333";
  item.style.display = "flex";
  item.style.justifyContent = "space-between";
  item.style.alignItems = "center";
  item.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
  item.style.borderLeft = `8px solid ${itemColor}`;
  item.style.cursor = 'pointer';
  item.setAttribute('onclick', `editTransaction(${t.id})`);

  item.innerHTML = `
    <div>
      <span style="font-weight:bold; font-size:15px;">${t.text}</span> 
      <br>
      <span style="background:${itemColor}; color:white; padding:2px 6px; border-radius:3px; font-size:10px; display:inline-block; margin-top:4px;">${t.cat}</span>
    </div>
    <div style="display: flex; align-items: center; gap: 15px;">
      <span style="color: ${isExpense ? '#e74c3c' : '#2ecc71'}; font-weight: bold; font-size:15px;">
        ${isExpense ? '-' : '+'}$${Math.abs(t.amount).toFixed(2)}
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
  if (confirm("Reset wallet back to the standard $10,000.00 baseline value?")) {
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
  
  if (total <= 0) {
    balanceCard.style.backgroundColor = '#fadbd8';
    balanceCard.style.color = '#78281f';
  } else if (total < 4000) {
    balanceCard.style.backgroundColor = '#fdebd0';
    balanceCard.style.color = '#7e5109';
  } else {
    balanceCard.style.backgroundColor = '#d4efdf';
    balanceCard.style.color = '#145a32';
  }
}

// Event listener for live button behavior adjustments
if(category) {
  category.onchange = () => {
      if(category.value === 'Salary') {
          submitBtn.innerText = 'Deposit Cash (Add)';
          submitBtn.style.background = '#2ecc71';
      } else {
          submitBtn.innerText = 'Purchase Item (Subtract)';
          submitBtn.style.background = '#e74c3c';
      }
  };
}

form.addEventListener('submit', saveTransaction);
applyThemeStyles();
