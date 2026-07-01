// DOM Element Node References Mapping Selection
const netWorthDisplay = document.getElementById('net-worth');
const savingsRateDisplay = document.getElementById('savings-rate');
const burnRateDisplay = document.getElementById('burn-rate');
const list = document.getElementById('list');
const form = document.getElementById('tracker-form');

const mainCategory = document.getElementById('main-category');
const subCategory = document.getElementById('sub-category');
const itemBrand = document.getElementById('item-brand');
const itemModel = document.getElementById('item-model');
const amount = document.getElementById('amount');
const category = document.getElementById('category');

const subCategoryContainer = document.getElementById('sub-category-container');
const brandContainer = document.getElementById('brand-container');
const modelContainer = document.getElementById('model-container');
const subCategoryLabel = document.getElementById('sub-category-label');
const brandLabel = document.getElementById('brand-label');
const modelLabel = document.getElementById('model-label');
const customTextContainer = document.getElementById('custom-text-container');
const customDesc = document.getElementById('custom-desc');

const submitBtn = document.getElementById('form-submit-btn');
const timelineMonth = document.getElementById('timeline-month');
const timelinePeriod = document.getElementById('timeline-period');
const sidebar = document.getElementById('history-sidebar');
const yearGrid = document.getElementById('year-contribution-grid');
const diurnalGrid = document.getElementById('diurnal-heatmap-grid');

const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayPeriods = ['Morning', 'Afternoon', 'Evening', 'Night'];

// Clean Nested Structured Price Database Object Mapping Ecosystem
const database = {
  Electronics: {
    Mobiles: {
      Apple: { "iPhone 14": 54900, "iPhone 15": 56900, "iPhone 16": 69900 },
      Samsung: { "Galaxy S23": 45000, "Galaxy S24": 49999, "Galaxy S25": 62349 },
      OPPO: { "OPPO Reno 11": 30000, "OPPO Reno 12": 32500, "OPPO Reno 13": 31990 }
    },
    Laptops: {
      Apple: { "MacBook Air M2": 84400, "MacBook Air M3": 104950, "MacBook Pro M3": 224900 },
      HP: { "Victus 15": 65000, "Pavilion 14": 72500, "Omen": 172500 },
      Dell: { "Inspiron 15": 60000, "XPS 13": 137500 }
    },
    Television: {
      Samsung: { "43 Inch Crystal 4K": 29990, "55 Inch Neo QLED": 74990 },
      Sony: { "55 Inch Bravia 4K": 57990, "65 Inch Google TV": 84990 },
      LG: { "43 Inch Smart LED": 26490, "55 Inch OLED Cinema": 119990 }
    }
  },
  Food: {
    Pizza: {
      "Margherita Pizza": { "Regular": 199, "Medium": 299, "Large": 449 },
      "Cheese Pizza": { "Regular": 229, "Medium": 349, "Large": 499 },
      "Farmhouse Pizza": { "Regular": 299, "Medium": 449, "Large": 649 },
      "Veggie Paradise": { "Regular": 299, "Medium": 449, "Large": 649 },
      "Deluxe Veggie Pizza": { "Regular": 329, "Medium": 479, "Large": 679 },
      "Paneer Tikka Pizza": { "Regular": 349, "Medium": 499, "Large": 699 },
      "Cheese & Corn Pizza": { "Regular": 279, "Medium": 399, "Large": 599 },
      "Mushroom Pizza": { "Regular": 299, "Medium": 429, "Large": 629 },
      "Mexican Green Wave": { "Regular": 329, "Medium": 479, "Large": 699 },
      "Pepperoni Pizza": { "Regular": 399, "Medium": 599, "Large": 849 },
      "Chicken Dominator": { "Regular": 449, "Medium": 649, "Large": 899 },
      "BBQ Chicken Pizza": { "Regular": 449, "Medium": 649, "Large": 899 },
      "Chicken Tikka Pizza": { "Regular": 429, "Medium": 629, "Large": 899 }
    },
    Burgers: {
      "Veg Burger": { "Standard": 99 }, "Aloo Tikki Burger": { "Standard": 79 }, "Crispy Veg Burger": { "Standard": 129 },
      "Cheese Burger": { "Standard": 149 }, "Paneer Burger": { "Standard": 179 }, "Double Cheese Burger": { "Standard": 199 },
      "Chicken Burger": { "Standard": 169 }, "Chicken Cheese Burger": { "Standard": 219 }, "Double Chicken Burger": { "Standard": 269 },
      "BBQ Chicken Burger": { "Standard": 249 }, "Grilled Chicken Burger": { "Standard": 279 }, "Veg Maharaja Burger": { "Standard": 249 },
      "Chicken Maharaja Burger": { "Standard": 299 }
    },
    "Wraps & Rolls": {
      "Veg Roll": { "Standard": 99 }, "Paneer Roll": { "Standard": 149 }, "Cheese Roll": { "Standard": 159 }, "Mushroom Roll": { "Standard": 149 },
      "Chicken Roll": { "Standard": 179 }, "Egg Roll": { "Standard": 129 }, "Chicken Tikka Roll": { "Standard": 219 }, "Double Chicken Roll": { "Standard": 249 }
    },
    Sandwiches: {
      "Veg Sandwich": { "Standard": 99 }, "Grilled Veg Sandwich": { "Standard": 129 }, "Cheese Sandwich": { "Standard": 149 },
      "Corn Cheese Sandwich": { "Standard": 159 }, "Paneer Sandwich": { "Standard": 179 }, "Chicken Sandwich": { "Standard": 199 },
      "Club Sandwich": { "Standard": 249 }
    },
    "Fries & Sides": {
      "French Fries": { "Standard": 99 }, "Peri Peri Fries": { "Standard": 129 }, "Cheese Fries": { "Standard": 169 }, "Potato Wedges": { "Standard": 149 },
      "Garlic Bread": { "Standard": 149 }, "Cheese Garlic Bread": { "Standard": 199 }, "Cheese Balls": { "Standard": 199 }, "Onion Rings": { "Standard": 149 },
      "Nachos": { "Standard": 199 }, "Loaded Nachos": { "Standard": 249 }
    },
    Momos: {
      "Veg Momos": { "Standard": 99 }, "Fried Veg Momos": { "Standard": 129 }, "Paneer Momos": { "Standard": 149 }, "Cheese Momos": { "Standard": 169 },
      "Chicken Momos": { "Standard": 159 }, "Fried Chicken Momos": { "Standard": 189 }, "Tandoori Momos": { "Standard": 229 }
    },
    Chinese: {
      "Veg Noodles": { "Half": 100, "Full": 200 }, "Hakka Noodles": { "Half": 110, "Full": 220 }, "Schezwan Noodles": { "Half": 120, "Full": 240 },
      "Veg Fried Rice": { "Half": 110, "Full": 220 }, "Schezwan Fried Rice": { "Half": 120, "Full": 240 }, "Paneer Fried Rice": { "Half": 130, "Full": 260 },
      "Veg Manchurian": { "Half": 120, "Full": 240 }, "Gobi Manchurian": { "Half": 120, "Full": 240 }, "Chilli Paneer": { "Half": 140, "Full": 280 }
    },
    Beverages: {
      "Coca-Cola": { "Standard": 50 }, "Pepsi": { "Standard": 50 }, "Sprite": { "Standard": 50 }, "Fanta": { "Standard": 50 },
      "Limca": { "Standard": 50 }, "Thums Up": { "Standard": 50 }, "Mineral Water": { "Standard": 20 }, "Cold Coffee": { "Standard": 149 },
      "Chocolate Shake": { "Standard": 179 }, "Vanilla Shake": { "Standard": 169 }, "Mango Shake": { "Standard": 179 }, "Oreo Shake": { "Standard": 199 }
    },
    KFC: {
      "Chicken Bucket (4 pcs)": { "Standard": 449 }, "Chicken Bucket (6 pcs)": { "Standard": 649 }, "Chicken Bucket (8 pcs)": { "Standard": 849 },
      "Hot & Crispy Chicken (2 pcs)": { "Standard": 249 }, "Hot & Crispy Chicken (4 pcs)": { "Standard": 449 }, "Chicken Popcorn (Regular)": { "Standard": 129 },
      "Chicken Popcorn (Large)": { "Standard": 249 }, "Crispy Chicken Burger": { "Standard": 199 }, "Zinger Burger": { "Standard": 249 },
      "Veg Zinger Burger": { "Standard": 199 }, "Chicken Roll": { "Standard": 199 }, "Chicken Twister Wrap": { "Standard": 249 },
      "Chicken Strips (3 pcs)": { "Standard": 249 }, "Chicken Strips (5 pcs)": { "Standard": 399 }, "French Fries (Regular)": { "Standard": 109 },
      "French Fries (Large)": { "Standard": 159 }, "Peri Peri Fries": { "Standard": 179 }, "Chicken Wings (6 pcs)": { "Standard": 299 },
      "Chicken Wings (12 pcs)": { "Standard": 549 }, "Chicken Nuggets (6 pcs)": { "Standard": 199 }, "Chicken Nuggets (9 pcs)": { "Standard": 279 },
      "Chicken Nuggets (20 pcs)": { "Standard": 549 }
    }
  }
};

let transactions = JSON.parse(localStorage.getItem('timeline_transactions')) || [];

// Trigger Cascading Form Field Dropdowns on User Interaction Action Shifts
function handleMainCategoryChange() {
  const selectedMain = mainCategory.value;

  if (selectedMain === 'Custom') {
    subCategoryContainer.style.display = 'none';
    brandContainer.style.display = 'none';
    modelContainer.style.display = 'none';
    customTextContainer.style.display = 'block';
    amount.value = '';
    category.value = 'Salary';
  } else {
    subCategoryContainer.style.display = 'block';
    brandContainer.style.display = 'block';
    customTextContainer.style.display = 'none';
    category.value = 'Expense';

    // Label styling adjustments dynamically applied 
    if (selectedMain === 'Electronics') {
      subCategoryLabel.innerText = "ELECTRONIC ITEM TYPE";
      brandLabel.innerText = "BRAND NAME";
      modelLabel.innerText = "MODEL DESCRIPTION";
    } else {
      subCategoryLabel.innerText = "FOOD CATEGORY";
      brandLabel.innerText = "SELECT SPECIFIC ITEM";
      modelLabel.innerText = "PORTION / SIZE SIZE VARIANT";
    }

    populateSubCategories();
  }
  updateButtonMode();
}

function populateSubCategories() {
  const selectedMain = mainCategory.value;
  if (!database[selectedMain]) return;

  subCategory.innerHTML = '';
  const subs = Object.keys(database[selectedMain]);
  
  subs.forEach(sub => {
    let opt = document.createElement('option');
    opt.value = sub;
    opt.innerText = sub.toUpperCase();
    subCategory.appendChild(opt);
  });
  populateBrands();
}

function populateBrands() {
  const selectedMain = mainCategory.value;
  const selectedSub = subCategory.value;
  if (!database[selectedMain]?.[selectedSub]) return;

  itemBrand.innerHTML = '';
  const brands = Object.keys(database[selectedMain][selectedSub]);

  brands.forEach(brand => {
    let opt = document.createElement('option');
    opt.value = brand;
    opt.innerText = brand;
    itemBrand.appendChild(opt);
  });
  populateModels();
}

function populateModels() {
  const selectedMain = mainCategory.value;
  const selectedSub = subCategory.value;
  const selectedBrand = itemBrand.value;
  if (!database[selectedMain]?.[selectedSub]?.[selectedBrand]) return;

  itemModel.innerHTML = '';
  const models = Object.keys(database[selectedMain][selectedSub][selectedBrand]);

  // If entry contains only standard pricing format, safely auto-hide structural model box
  if (models.length === 1 && models[0] === 'Standard') {
    modelContainer.style.display = 'none';
  } else {
    modelContainer.style.display = 'block';
  }

  models.forEach(model => {
    let opt = document.createElement('option');
    opt.value = model;
    opt.innerText = model.toUpperCase();
    itemModel.appendChild(opt);
  });
  autoUpdatePrice();
}

function autoUpdatePrice() {
  const selectedMain = mainCategory.value;
  const selectedSub = subCategory.value;
  const selectedBrand = itemBrand.value;
  const selectedModel = itemModel.value;

  if (database[selectedMain]?.[selectedSub]?.[selectedBrand]?.[selectedModel] !== undefined) {
    amount.value = database[selectedMain][selectedSub][selectedBrand][selectedModel];
  }
}

function updateButtonMode() {
  if (!submitBtn) return;
  if (category.value === 'Salary') {
    submitBtn.style.background = '#10b981';
    submitBtn.innerText = 'DEPOSIT FUNDS';
  } else {
    submitBtn.style.background = '#ef4444';
    submitBtn.innerText = 'SUBTRACT TRANSACTION';
  }
}

function toggleSidebar(open) {
  if (!sidebar) return;
  sidebar.style.right = open ? '0px' : '-320px';
}

function recalculateDashboardMetrics() {
  const startingBalance = 30000;
  let totalDeposits = 0;
  let totalExpenses = 0;

  transactions.forEach(t => {
    if (t.amount > 0) totalDeposits += t.amount;
    else totalExpenses += Math.abs(t.amount);
  });

  const netWorth = startingBalance + totalDeposits - totalExpenses;
  if (netWorthDisplay) netWorthDisplay.innerText = netWorth.toFixed(2);

  const overallIncomePool = startingBalance + totalDeposits;
  const savingsRate = overallIncomePool > 0 ? ((netWorth / overallIncomePool) * 100) : 0;
  if (savingsRateDisplay) savingsRateDisplay.innerText = `${Math.max(0, Math.min(100, savingsRate)).toFixed(0)}%`;

  const burnRate = totalExpenses / 30;
  if (burnRateDisplay) burnRateDisplay.innerText = `₹${burnRate.toFixed(2)}/day`;
}

function renderYearlyMap() {
  if (!yearGrid) return;
  yearGrid.innerHTML = '';
  let monthlySpend = Array(12).fill(0);

  transactions.forEach(t => {
    if (t.amount < 0) monthlySpend[t.month] += Math.abs(t.amount);
  });

  monthsList.forEach((month, index) => {
    const spend = monthlySpend[index];
    let cellBg = '#333333'; let textColor = '#aaaaaa';
    
    if (spend > 0 && spend <= 5000) { cellBg = '#064e3b'; textColor = '#34d399'; }
    else if (spend > 5000 && spend <= 20000) { cellBg = '#047857'; textColor = '#a7f3d0'; }
    else if (spend > 20000) { cellBg = '#10b981';
