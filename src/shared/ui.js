/* ==========================================
   🪟 UI / MODALS & HELPERS
========================================== */

window.openModal = function (id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.add("show");
    document.body.classList.add("modal-open");
};

window.closeModal = function () {
    document.querySelectorAll(".modal").forEach(m => {
        m.classList.remove("show");
    });

    document.body.classList.remove("modal-open");
};

window.addEventListener("click", (e) => {
    document.querySelectorAll(".modal").forEach(m => {
        if (e.target === m) closeModal();
    });
});

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});

/* ==========================================
   🔔 TOAST
========================================== */
function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* ==========================================
   ⚠️ CONFIRM
========================================== */
function confirmAction(message = "Är du säker?") {
    return confirm(message);
}

/* ==========================================
   📅 CREATE MODAL
========================================== */
function openVacationModal(start, end) {
    const employees = getEmployees();

    const select = document.getElementById("modalEmployee");
    const startInput = document.getElementById("modalStart");
    const endInput = document.getElementById("modalEnd");

    select.innerHTML = "";

    employees.forEach(e => {
        select.innerHTML += `<option value="${e.id}">${e.name}</option>`;
    });

    startInput.value = start.split("T")[0];
    endInput.value = end.split("T")[0];

    openModal("vacationModal");
}

window.submitVacationModal = function () {
    const employee_id = document.getElementById("modalEmployee").value;
    const start = document.getElementById("modalStart").value;
    const end = document.getElementById("modalEnd").value;

    const created = createVacation({
        employee_id,
        start,
        end
    });

    if (!created) return;

    closeModal();
    renderCalendar();

    showToast("Semester skapad", "success");
};

/* ==========================================
   ✏️ EDIT MODAL
========================================== */
function openEditVacationModal(event) {
    const employees = getEmployees();
    const vacation = getVacationById(event.id);

    if (!vacation) return;

    const select = document.getElementById("editEmployee");
    select.innerHTML = "";

    employees.forEach(e => {
        select.innerHTML += `<option value="${e.id}">${e.name}</option>`;
    });

    document.getElementById("editVacationId").value = vacation.id;
    document.getElementById("editEmployee").value = vacation.employee_id;
    document.getElementById("editStart").value = vacation.start;
    document.getElementById("editEnd").value = vacation.end;

    openModal("editVacationModal");
}

window.submitEditVacation = function () {
    const id = document.getElementById("editVacationId").value;
    const employee_id = document.getElementById("editEmployee").value;
    const start = document.getElementById("editStart").value;
    const end = document.getElementById("editEnd").value;

    updateVacationById(id, {
        employee_id,
        start,
        end
    });

    closeModal();
    renderCalendar();

    showToast("Uppdaterad!", "success");
};
