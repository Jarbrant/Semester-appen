/* ==========================================
   💾 STORAGE (DATA LAYER)
   Ansvar:
   - Hantera localStorage
   - Standardisera data access
   - Säkerställa stabil lagring
========================================== */

/* ==========================================
   🔑 STORAGE KEYS (single source of truth)
========================================== */
const STORAGE_KEYS = {
    employees: "employees",
    vacations: "vacations"
};

/* ==========================================
   🧠 GENERIC HELPERS (nice to have)
========================================== */

// 🔹 säker JSON parse (undviker crash)
function safeParse(data) {
    try {
        return JSON.parse(data);
    } catch (e) {
        console.warn("⚠️ Kunde inte parsa data:", e);
        return null;
    }
}

// 🔹 generisk get
function getItem(key) {
    const raw = localStorage.getItem(key);
    const parsed = safeParse(raw);

    return parsed || [];
}

// 🔹 generisk save
function setItem(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error("❌ Kunde inte spara data:", e);
    }
}

/* ==========================================
   👥 EMPLOYEES
========================================== */

function getEmployees() {
    return getItem(STORAGE_KEYS.employees);
}

function saveEmployees(data) {
    setItem(STORAGE_KEYS.employees, data);
}

/* ==========================================
   📅 VACATIONS
========================================== */

function getVacations() {
    return getItem(STORAGE_KEYS.vacations);
}

function saveVacations(data) {
    setItem(STORAGE_KEYS.vacations, data);
}

/* ==========================================
   🚀 INIT (nice to have)
   - Skapar tomma arrays om inget finns
========================================== */
function initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.employees)) {
        saveEmployees([]);
    }

    if (!localStorage.getItem(STORAGE_KEYS.vacations)) {
        saveVacations([]);
    }
}

/* ==========================================
   🧹 RESET STORAGE (dev tool)
========================================== */
function clearAllData() {
    if (confirm("Rensa ALL data?")) {
        localStorage.clear();
        location.reload();
    }
}

/* ==========================================
   📦 EXPORT / IMPORT (nice to have)
========================================== */

// 🔹 exportera backup
function exportData() {
    const data = {
        employees: getEmployees(),
        vacations: getVacations()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "semester-backup.json";
    a.click();

    URL.revokeObjectURL(url);
}

// 🔹 importera backup
function importData(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);

            if (data.employees) saveEmployees(data.employees);
            if (data.vacations) saveVacations(data.vacations);

            alert("Data importerad!");
            location.reload();
        } catch (err) {
            alert("Felaktig fil");
        }
    };

    reader.readAsText(file);
}
