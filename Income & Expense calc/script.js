// Fetching data from local storage or initializing empty array
let entries = JSON.parse(localStorage.getItem('entries')) || [];

const entryForm = document.getElementById('entry-form');
const entriesList = document.getElementById('entries-list');
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expense');
const netBalance = document.getElementById('net-balance');

// Add new entry
entryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    const newEntry = { description, amount, type, id: Date.now() };
    entries.push(newEntry);
    updateLocalStorage();
    displayEntries();
    entryForm.reset();
});

// Display entries
function displayEntries(filter = 'all') {
    entriesList.innerHTML = '';
    let filteredEntries = entries;

    if (filter !== 'all') {
        filteredEntries = entries.filter(entry => entry.type === filter);
    }

    filteredEntries.forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${entry.description} - ₹${entry.amount.toFixed(2)} (${entry.type})</span>
            <div class="actions">
                <button onclick="editEntry(${entry.id})">Edit</button>
                <button onclick="deleteEntry(${entry.id})">Delete</button>
            </div>
        `;
        entriesList.appendChild(li);
    });

    updateTotals();
}

// Update totals
function updateTotals() {
    const totalInc = entries.filter(entry => entry.type === 'income').reduce((sum, entry) => sum + entry.amount, 0);
    const totalExp = entries.filter(entry => entry.type === 'expense').reduce((sum, entry) => sum + entry.amount, 0);
    T_Come.textContent = ` ₹${totalInc.toFixed(2)}`;
    T_Exp.textContent = ` ₹${totalExp.toFixed(2)}`;
    N_Bal.textContent = ` ₹${(totalInc - totalExp).toFixed(2)}`;
}


// Edit entry
function editEntry(id) {
    const entry = entries.find(entry => entry.id === id);
    document.getElementById('description').value = entry.description;
    document.getElementById('amount').value = entry.amount;
    document.getElementById('type').value = entry.type;

    deleteEntry(id); 
}

// Delete entry
function deleteEntry(id) {
    entries = entries.filter(entry => entry.id !== id);
    updateLocalStorage();
    displayEntries();
}

// Update local storage
function updateLocalStorage() {
    localStorage.setItem('entries', JSON.stringify(entries));
}

// Filter entries by type
document.querySelectorAll('input[name="filter"]').forEach(filterRadio => {
    filterRadio.addEventListener('change', (e) => {
        displayEntries(e.target.value);
    });
});

// Initial display
displayEntries();
