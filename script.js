const admin = { username: "q", password: "password" };

function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  const status = document.getElementById("login-status");

  if (u === admin.username && p === admin.password) {
    status.innerHTML = "✅ Login successful!";
    document.getElementById("login-section").style.display = "none";
    document.getElementById("app-section").style.display = "block";
    displayEntries();
  } else {
    status.innerHTML = "❌ Invalid credentials!";
  }
}

function saveEntry() {
  const truck = document.getElementById("truck").value;
  const mpesa = document.getElementById("mpesa").value;
  const amount = document.getElementById("amount").value;
  const destination = document.getElementById("destination").value;

  if (!truck || !mpesa || !amount || !destination) {
    alert("Please fill all fields.");
    return;
  }

  const entry = { truck, mpesa, amount, destination, id: Date.now() };
  const entries = JSON.parse(localStorage.getItem("thiwascoEntries")) || [];
  entries.push(entry);
  localStorage.setItem("thiwascoEntries", JSON.stringify(entries));
  displayEntries();

  document.getElementById("truck").value = "";
  document.getElementById("mpesa").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("destination").value = "";
}

function displayEntries() {
  const display = document.getElementById("entries");
  const entries = JSON.parse(localStorage.getItem("thiwascoEntries")) || [];
  display.innerHTML = "";

  entries.forEach(entry => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <p><strong>Truck:</strong> ${entry.truck}</p>
      <p><strong>MPesa:</strong> ${entry.mpesa}</p>
      <p><strong>Amount:</strong> Ksh ${entry.amount}</p>
      <p><strong>Destination:</strong> ${entry.destination}</p>
      <button class="edit-btn" onclick="editEntry(${entry.id})">Edit</button>
      <button class="delete-btn" onclick="deleteEntry(${entry.id})">Delete</button>
    `;
    display.appendChild(div);
  });
}

function editEntry(id) {
  const entries = JSON.parse(localStorage.getItem("thiwascoEntries")) || [];
  const entry = entries.find(e => e.id === id);
  if (entry) {
    document.getElementById("truck").value = entry.truck;
    document.getElementById("mpesa").value = entry.mpesa;
    document.getElementById("amount").value = entry.amount;
    document.getElementById("destination").value = entry.destination;
    deleteEntry(id);
  }
}

function deleteEntry(id) {
  let entries = JSON.parse(localStorage.getItem("thiwascoEntries")) || [];
  entries = entries.filter(e => e.id !== id);
  localStorage.setItem("thiwascoEntries", JSON.stringify(entries));
  displayEntries();
}

function downloadAllAsPDF() {
  const entries = JSON.parse(localStorage.getItem("thiwascoEntries")) || [];

  if (entries.length === 0) {
    alert("No entries to download.");
    return;
  }

  const win = window.open('', '', 'width=800,height=700');
  win.document.write(`<html><head><title>Thiwasco Full Receipt</title></head><body>`);
  win.document.write(`<h2>Thiwasco Water Delivery Records</h2><hr>`);

  entries.forEach((entry, index) => {
    win.document.write(`<p><strong>Entry ${index + 1}</strong></p>`);
    win.document.write(`<p>🚚 <strong>Truck:</strong> ${entry.truck}</p>`);
    win.document.write(`<p>📱 <strong>MPesa Ref:</strong> ${entry.mpesa}</p>`);
    win.document.write(`<p>💰 <strong>Amount:</strong> Ksh ${entry.amount}</p>`);
    win.document.write(`<p>📍 <strong>Destination:</strong> ${entry.destination}</p>`);
    win.document.write(`<hr>`);
  });

  win.document.write(`</body></html>`);
  win.document.close();
  win.print();
}

