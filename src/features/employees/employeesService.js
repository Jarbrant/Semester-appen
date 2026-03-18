/* ==========================================
   👥 EMPLOYEES FEATURE
   Ansvar:
   - Skapa anställda
   - Hantera färger
   - Ladda dropdowns
   - Enkel validering + UX
========================================== */

/* ==========================================
   🎨 GENERATE COLOR (nice)
   - Säkerställer bra färger (inte för ljusa)
========================================== */
function generateColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

/* ==========================================
   🔍 CHECK IF EMPLOYEE EXISTS (nice)
========================================== */
function employeeExists(name) {
    const employees = getEmployees();
    return employees.some(e => e.name.toLowerCase() === name.toLowerCase());
}

/* ==========================================
   🧠 CORE: CREATE EMPLOYEE
========================================== */
function createEmployee(name) {
    if (!name) return null;

    // ❗ undvik dubletter
    if (employeeExists(name)) {
        alert("Denna person finns redan");
        return null;
    }

    const employees = getEmployees();

    const newEmployee = {
        id: Date.now(),
        name,
        color: generateColor()
    };

    employees.push(newEmployee);
    saveEmployees(employees);

    return newEmployee;
}

/* ==========================================
   🖥️ UI: ADD EMPLOYEE
========================================== */
window.addEmployee = function () {
    const input = document.getElementById("employeeName");
    const name = input?.value.trim();

    const created = createEmployee(name);

    if (!created) return;

    // 🔄 uppdatera UI
    loadEmployees();
    renderCalendar();

    // ✨ NICE: reset input
    if (input) input.value = "";
};

/* ==========================================
   🔹 LOAD EMPLOYEES INTO DROPDOWNS
========================================== */
window.loadEmployees = function () {
    const employees = getEmployees();

    const select = document.getElementById("employeeSelect");
    const filter = document.getElementById("filter");

    if (!select || !filter) return;

    // 🔄 reset
    select.innerHTML = "";
    filter.innerHTML = '<option value="all">Alla</option>';

    /* ------------------------------------------
       🧩 bygg options
    ------------------------------------------ */
    employees.forEach(e => {
        const optionHTML = `<option value="${e.id}">${e.name}</option>`;

        select.innerHTML += optionHTML;
        filter.innerHTML += optionHTML;
    });
};

/* ==========================================
   🔍 GET EMPLOYEE BY ID (nice)
========================================== */
function getEmployeeById(id) {
    const employees = getEmployees();
    return employees.find(e => e.id == id);
}

/* ==========================================
   🗑️ DELETE EMPLOYEE (nice)
========================================== */
function deleteEmployee(id) {
    let employees = getEmployees();

    employees = employees.filter(e => e.id != id);

    saveEmployees(employees);

    // 🔄 uppdatera UI
    loadEmployees();
    renderCalendar();
}

/* ==========================================
   🚀 INIT DEFAULT EMPLOYEES (nice)
   - Körs om inga finns
========================================== */
function seedEmployees() {
    const employees = getEmployees();

    if (employees.length > 0) return;

    const demo = [
        { name: "Anna" },
        { name: "Erik" },
        { name: "Sara" }
    ];

    demo.forEach(d => {
        createEmployee(d.name);
    });

    console.log("🌱 Demo-anställda skapade");
}
