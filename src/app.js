/* ==========================================
   🚀 APP INIT (BOOTSTRAP)
   Ansvar:
   - Starta appen
   - Initiera storage
   - Ladda grunddata
   - Hantera auth (fallback/demo)
========================================== */

/* ==========================================
   🔄 START APP
========================================== */
window.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Startar app...");

    try {
        // 🔹 säkerställ att storage är redo
        initStorage();

        // 🔹 ladda grunddata
        loadEmployees();

        // 🔹 säkerställ att user finns
        ensureUser();

        // 🔹 render UI
        renderCalendar();

        console.log("✅ App startad korrekt");
    } catch (err) {
        console.error("❌ Fel vid app-start:", err);
    }
});

/* ==========================================
   👤 AUTH HANDLING (nice to have)
========================================== */
function ensureUser() {
    let user = getCurrentUser();

    if (!user) {
        console.warn("⚠️ Ingen användare hittades → startar demo user");

        // 🔹 demo fallback
        login("Admin", "admin");

        user = getCurrentUser();
    }

    console.log("👤 Aktiv användare:", user);

    return user;
}

/* ==========================================
   🔄 GLOBAL REFRESH (nice to have)
   - Uppdaterar hela UI
========================================== */
function refreshApp() {
    renderCalendar();
}

/* ==========================================
   🧪 DEV MODE HELPERS (nice)
========================================== */

// 🔹 gör vissa funktioner tillgängliga i console
window.dev = {
    clearAllData,
    exportData,
    importData,
    refreshApp
};

/* ==========================================
   📡 AUTO-RENDER VID STORAGE CHANGE (nice)
   - uppdaterar om data ändras i annan flik
========================================== */
window.addEventListener("storage", (event) => {
    if (event.key === "vacations" || event.key === "employees") {
        console.log("🔄 Data ändrad → uppdaterar UI");
        renderCalendar();
    }
});
