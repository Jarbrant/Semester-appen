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
        if (typeof initStorage === "function") {
            initStorage();
        }

        // 🔹 skapa demo-data om tomt (nice)
        if (typeof seedEmployees === "function") {
            seedEmployees();
        }

        // 🔹 ladda UI-data
        if (typeof loadEmployees === "function") {
            loadEmployees();
        }

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
    if (typeof getCurrentUser !== "function") return null;

    let user = getCurrentUser();

    if (!user) {
        console.warn("⚠️ Ingen användare hittades → startar demo user");

        if (typeof login === "function") {
            login("Admin", "admin");
            user = getCurrentUser();
        }
    }

    console.log("👤 Aktiv användare:", user);

    return user;
}

/* ==========================================
   🔄 GLOBAL REFRESH (nice to have)
   - Uppdaterar hela UI
========================================== */
function refreshApp() {
    if (typeof renderCalendar === "function") {
        renderCalendar();
    }

    if (typeof loadEmployees === "function") {
        loadEmployees();
    }
}

/* ==========================================
   🧪 DEV MODE HELPERS (nice)
========================================== */
window.dev = {
    clearAllData: typeof clearAllData === "function" ? clearAllData : () => {},
    exportData: typeof exportData === "function" ? exportData : () => {},
    importData: typeof importData === "function" ? importData : () => {},
    refreshApp
};

/* ==========================================
   📡 AUTO-RENDER VID STORAGE CHANGE (nice)
   - uppdaterar om data ändras i annan flik
========================================== */
window.addEventListener("storage", (event) => {
    if (event.key === "vacations" || event.key === "employees") {
        console.log("🔄 Data ändrad → uppdaterar UI");

        refreshApp();
    }
});
