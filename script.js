// DOM Element Nodes
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

// Fixed Database Architecture Layer matching application paths
const database = {
  Electronics: {
    "Mobiles": {
      "Apple": { "iPhone 14": 54900, "iPhone 15": 68900, "iPhone 16": 79900 },
      "Samsung": { "Galaxy S24": 74999, "Galaxy S25": 82300 },
      "OPPO": { "A3 Pro 5G": 17999, "Reno 12": 32500 }
    },
    "Laptops": {
      "Apple": { "MacBook Air M2": 84400, "MacBook Air M3": 104900 },
      "HP": { "Victus 15": 62000, "Pavilion 14": 68500 },
      "Dell": { "Inspiron 15": 54000 }
    }
  },
  Food: {
    "Pizza Menu": {
      "Margherita Pizza": { "Small": 199, "Medium": 299, "Large": 449 },
      "Farmhouse Pizza": { "Small": 299, "Medium": 449, "Large": 649 }
    },
    "Burgers Menu": {
      "Crispy Veg Burger": { "Standard": 129 },
      "Cheese Burger": { "Standard": 159 },
      "Chicken Maharaja": { "Standard": 299 }
    },
    "Wraps & Rolls": {
      "Veg Kathi Roll": { "Standard": 120 },
      "Chicken Tikka Wrap": { "Standard": 180 }
    },
    "Fries & Sides": {
      "Classic Fries": { "Regular": 99, "Large": 149 },
      "Garlic Breadsticks": { "Standard": 139 }
    },
    "KFC Menu": {
      "Chicken Bucket (4pc)": { "Standard": 449 },
      "Zinger Burger": { "Standard": 219 }
    }
  }
};

let transactions = JSON.parse(localStorage.getItem('timeline_transactions')) || [];

// Cascading Dropdown Engine
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

    if (selectedMain === 'Electronics') {
      subCategoryLabel.innerText = "ELECTRONIC ITEM TYPE";
      brandLabel.innerText = "BRAND NAME";
      modelLabel.innerText = "MODEL DESCRIPTION";
    } else {
      subCategoryLabel.innerText = "ITEM TYPE GROUP";
      brandLabel.innerText = "BRAND / SPECIFIC PRODUCT";
      modelLabel.innerText = "MODEL VARIANT / SIZE";
    }
    populateSubCategories();
  }
  updateButtonMode();
}

function populateSubCategories() {
