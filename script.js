// Get DOM elements
const balance = document.getElementById('balance');
const list = document.getElementById('list');
const form = document.getElementById('tracker-form');
const text = document.getElementById('desc');
const amount = document.getElementById('amount');

// Load transactions from LocalStorage so data doesn't disappear on refresh
let transactions = localStorage.getItem('transactions') !== null 
  ? JSON.parse(localStorage.getItem('transactions')) 
  : [];

// Add a transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a description and amount');
    return;
  }

  const transaction = {
    id: Math.floor(Math.random() * 100000000),
    text: text.value,
    amount: +amount.value
  };

  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();

  text.value = '';
  amount.value = '';
}

// Add transaction to the screen list with a delete button
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  // Dynamic styling based on positive/negative amount
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.style.display = 'flex';
  item.style.justifyContent = 'space-between';
  item.style.padding = '10px';
  item.style.margin = '10px 0';
  item.style.background = '#f9f9f9';
  item.style.borderRadius = '5px';
  item.style.borderRight = transaction.amount < 0 ? '5px solid #e74c3c' : '5px solid #2ecc71';

  item.innerHTML = `
    ${transaction.text} <span>${sign}$${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})" style="cursor:pointer; background:#e74c3c; color:white; border:0; padding:2px 7px; border-radius:3px; margin-left:10px;">X</button>
  `;

  list.appendChild(item);
}

// Update the total balance
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  balance.innerText = `$${total}`;
}

// Remove transaction by clicking 'X'
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Update LocalStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize App
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

// Event listener for form submission
form.addEventListener('submit', addTransaction);
