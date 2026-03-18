/* ==========================================
   📅 VACATIONS FEATURE
   Ansvar:
   - Skapa, uppdatera, ta bort semester
   - Validering av data
   - Central logik (återanvändbar från flera ställen)
========================================== */

/* ==========================================
   🧠 CORE: CREATE VACATION (REUSABLE)
   - Används av:
     - form (UI)
     - calendar select
========================================== */
function createVacation({ employee_id, start, end }) {
    // 🔍 validering
    if (!employee_id || !start || !end) {
        console.warn("❗ Saknar data för semester");
        return false;
    }

    // 📅 säkerställ att slutdatum inte är före start
    if (new Date(end) < new Date(start)) {
        alert("Slutdatum kan inte vara före startdatum");
        return false;
    }

    const vacations = getVacations();

    const newVacation = {
        id: Date.now(),
        employee_id,
        start,
        end
    };

    vacations.push(newVacation);
    saveVacations(vacations);

    return newVacation; // 🔥 gör den användbar för UI
}

/* ==========================================
   🔄 UPDATE VACATION
========================================== */
function updateVacationById(id, updates) {
    let vacations = getVacations();

    vacations = vacations.map(v => {
        if (v.id == id) {
            return {
                ...v,
                ...updates
            };
        }
        return v;
    });

    saveVacations(vacations);
}

/* ==========================================
   ❌ DELETE VACATION
========================================== */
function deleteVacationById(id) {
    let vacations = getVacations();

    vacations = vacations.filter(v => v.id != id);

    saveVacations(vacations);
}

/* ==========================================
   🔍 GET VACATION BY ID (nice to have)
========================================== */
function getVacationById(id) {
    const vacations = getVacations();
    return vacations.find(v => v.id == id);
}

/* ==========================================
   📊 GET VACATIONS BY EMPLOYEE (nice)
========================================== */
function getVacationsByEmployee(employeeId) {
    const vacations = getVacations();
    return vacations.filter(v => v.employee_id == employeeId);
}

/* ==========================================
   🖥️ UI: ADD VACATION FROM FORM
========================================== */
window.addVacation = function () {
    const empId = document.getElementById("employeeSelect").value;
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;

    const created = createVacation({
        employee_id: empId,
        start,
        end
    });

    // ❗ om något gick fel → avbryt
    if (!created) return;

    // 🔄 uppdatera UI
    renderCalendar();

    // ✨ NICE: reset form
    resetVacationForm();
};

/* ==========================================
   🧹 RESET FORM (nice UX)
========================================== */
function resetVacationForm() {
    const emp = document.getElementById("employeeSelect");
    const start = document.getElementById("startDate");
    const end = document.getElementById("endDate");

    if (emp) emp.value = "";
    if (start) start.value = "";
    if (end) end.value = "";
}
