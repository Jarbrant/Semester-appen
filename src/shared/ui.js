/* ==========================================
   🪟 UI / MODALS & HELPERS
   Ansvar:
   - Hantera modals
   - Små UI utilities
   - Förbättra UX (alerts, loading, etc)
========================================== */

/* ==========================================
   🪟 OPEN MODAL
========================================== */
window.openModal = function (id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.add("show");

    // 🔒 lås scroll i bakgrunden
    document.body.classList.add("modal-open");
};

/* ==========================================
   ❌ CLOSE MODALS
========================================== */
window.closeModal = function () {
    document.querySelectorAll(".modal").forEach(m => {
        m.classList.remove("show");
    });

    document.body.classList.remove("modal-open");
};

/* ==========================================
   🔥 CLICK OUTSIDE → CLOSE
========================================== */
window.addEventListener("click", (e) => {
    document.querySelectorAll(".modal").forEach(m => {
        if (e.target === m) {
            m.classList.remove("show");
            document.body.classList.remove("modal-open");
        }
    });
});

/* ==========================================
   ⌨️ ESC → CLOSE
========================================== */
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});

/* ==========================================
   🔔 TOAST (nice UX)
========================================== */
function showToast(message, type = "info") {
    const toast = document.createElement("div");

    toast.className = `toast toast-${type}`;
    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* ==========================================
   ⚠️ CONFIRM (bättre än alert)
========================================== */
function confirmAction(message = "Är du säker?") {
    return confirm(message);
}

/* ==========================================
   ⏳ LOADING STATE (nice)
========================================== */
function setLoading(isLoading) {
    document.body.classList.toggle("loading", isLoading);
}

/* ==========================================
   🎯 FOCUS FIRST INPUT (nice UX)
========================================== */
function focusFirstInput(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const input = modal.querySelector("input, select, textarea");
    if (input) input.focus();
}

/* ==========================================
   🔄 QUICK UI HELPERS (nice)
========================================== */

// 🔹 disable button temporärt
function disableButton(btn, time = 1000) {
    if (!btn) return;

    btn.disabled = true;
    setTimeout(() => (btn.disabled = false), time);
}

// 🔹 set text
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

// 🔹 toggle element
function toggleElement(id, show = true) {
    const el = document.getElementById(id);
    if (!el) return;

    el.style.display = show ? "block" : "none";
}

/* ==========================================
   🧪 DEV HOOK (optional)
========================================== */
window.ui = {
    showToast,
    setLoading,
    openModal,
    closeModal
};
