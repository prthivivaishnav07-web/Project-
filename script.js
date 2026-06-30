const balance = document.getElementById('balance');
const list = document.getElementById('list');
const form = document.getElementById('tracker-form');
const desc = document.getElementById('desc');
const amount = document.getElementById('amount');

let transactions = [];

function addTransaction(e) {
    e.preventDefault();
    const transaction = {
        id: Date.now(),
        text: desc.value,
        amount: +amount.value
    };
    transactions.push(transaction);
    updateDOM();
    form.reset();
}

function updateDOM() {
    list.innerHTML = '';
    let total = 0;
    
    transactions.forEach(t => {
        const sign = t.amount < 0 ? '-' : '+';
        const item = document.createElement('li');
        item.classList.add(t.amount < 0 ? 'minus' : 'plus');
        item.innerHTML = `${t.text} <span>${sign}$${Math.abs(t.amount)}</span>`;
        list.appendChild(item);
        total += t.amount;
    });
    
    balance.innerText = total.toFixed(2);
}

form.addEventListener('submit', addTransaction);
