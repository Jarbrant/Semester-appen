/* ==========================================
   🚀 APP INIT (BOOTSTRAP)
   Ansvar:
   - Starta appen
   - Initiera storage
   - Ladda grunddata
   - Hantera auth
   - Synka UI
========================================== */

/* ==========================================
   🔄 START APP
========================================== */
window.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Startar app...");

    try {
        setLoading(true); // ⏳ visa loading

        /* ------------------------------------------
           🔧 INIT STORAGE
        ------------------------------------------ */
        if (typeof initStorage === "function") {
            initStorage();
        }

        /* ------------------------------------------
           🌱 DEMO DATA
        ------------------------------------------ */
        if (typeof seedEmployees === "function") {
            seedEmployees();
        }

        /* ------------------------------------------
           👥 LOAD UI DATA
        ------------------------------------------ */
        if (typeof loadEmployees === "function") {
            loadEmployees();
        }

        /* ------------------------------------------
           🔐 AUTH
        ------------------------------------------ */
        const user = ensureUser();

        /* ------------------------------------------
           👤 UPDATE UI (user)
        ------------------------------------------ */
        if (user && typeof setText === "function") {
            setText("currentUser", `👤 ${user.name}`);
        }

        /* ------------------------------------------
           📅 RENDER
        ------------------------------------------ */
        if (typeof renderCalendar === "function") {
            renderCalendar();
        }

        console.log("✅ App startad korrekt");

    } catch (err) {
        console.error("❌ Fel vid app-start:", err);
        showToast?.("Fel vid start av app", "error");
    } finally {
        setLoading(false); // ⏳ ta bort loading
    }
});

/* ==========================================
   👤 AUTH HANDLING
========================================== */
function ensureUser() {
    if (typeof getCurrentUser !== "function") return null;

    let user = getCurrentUser();

    if (!user) {
        console.warn("⚠️ Ingen användare → skapar demo");

        if (typeof login === "function") {
            login("Admin", "admin");
            user = getCurrentUser();
        }
    }

    console.log("👤 Aktiv användare:", user);

    return user;
}

/* ==========================================
   🔄 GLOBAL REFRESH
   - Uppdaterar hela UI
========================================== */
function refreshApp() {
    console.log("🔄 Refresh app");

    if (typeof loadEmployees === "function") {
        loadEmployees();
    }

    if (typeof renderCalendar === "function") {
        renderCalendar();
    }

    // 🔄 uppdatera user UI igen
    const user = getCurrentUser?.();
    if (user && typeof setText === "function") {
        setText("currentUser", `👤 ${user.name}`);
    }
}

/* ==========================================
   🧪 DEV MODE (power tools)
========================================== */
window.dev = {
    clearAllData: typeof clearAllData === "function" ? clearAllData : () => {},
    exportData: typeof exportData === "function" ? exportData : () => {},
    importData: typeof importData === "function" ? importData : () => {},
    refreshApp,

    // 🔥 extra dev helpers
    loginAsAdmin: () => login?.("Admin", "admin"),
    loginAsUser: () => login?.("User", "user")
};

/* ==========================================
   📡 STORAGE SYNC (multi-tab support)
========================================== */
window.addEventListener("storage", (event) => {
    if (event.key === "vacations" || event.key === "employees") {
        console.log("🔄 Data ändrad i annan flik");

        showToast?.("Data uppdaterad", "info");

        refreshApp();
    }
});

/* ==========================================
   ⌨️ GLOBAL SHORTCUTS (nice UX)
========================================== */
window.addEventListener("keydown", (e) => {
    // 🔄 CTRL + R = refresh app (utan reload)
    if (e.ctrlKey && e.key === "r") {
        e.preventDefault();
        refreshApp();
        showToast?.("App uppdaterad", "info");
    }
});
