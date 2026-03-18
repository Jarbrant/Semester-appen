/* ==========================================
   🔐 AUTH SERVICE
   Ansvar:
   - Hantera login/logout
   - Hantera user session
   - Rollkontroll (admin/user)
========================================== */

/* ==========================================
   🔑 STORAGE KEY
========================================== */
const USER_KEY = "user";

/* ==========================================
   🧠 SAFE PARSE (undvik crash)
========================================== */
function safeParse(data) {
    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
}

/* ==========================================
   👤 GET CURRENT USER
========================================== */
function getCurrentUser() {
    const raw = localStorage.getItem(USER_KEY);
    return safeParse(raw);
}

/* ==========================================
   🔐 LOGIN
   - sparar user i localStorage
========================================== */
window.login = function (name, role = "user") {
    if (!name) {
        console.warn("⚠️ login saknar namn");
        return null;
    }

    const user = {
        id: Date.now(),
        name,
        role: role || "user",
        loginAt: new Date().toISOString()
    };

    localStorage.setItem(USER_KEY, JSON.stringify(user));

    console.log("🔐 Inloggad:", user);

    return user;
};

/* ==========================================
   🚪 LOGOUT
========================================== */
window.logout = function () {
    localStorage.removeItem(USER_KEY);

    console.log("🚪 Utloggad");

    location.reload();
};

/* ==========================================
   🔒 ROLE CHECKS
========================================== */
function isAdmin() {
    const user = getCurrentUser();
    return user?.role === "admin";
}

function isLoggedIn() {
    return !!getCurrentUser();
}

/* ==========================================
   🔄 REQUIRE AUTH (nice)
   - skydda funktioner
========================================== */
function requireAuth() {
    if (!isLoggedIn()) {
        alert("Du måste vara inloggad");
        return false;
    }
    return true;
}

/* ==========================================
   🔐 REQUIRE ADMIN (nice)
========================================== */
function requireAdmin() {
    if (!isAdmin()) {
        alert("Endast admin har tillgång");
        return false;
    }
    return true;
}

/* ==========================================
   🧪 DEV: SET ROLE QUICKLY (nice)
========================================== */
function setRole(role) {
    const user = getCurrentUser();
    if (!user) return;

    user.role = role;
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    console.log("🔄 Roll ändrad till:", role);
}

/* ==========================================
   📡 SESSION INFO (nice)
========================================== */
function getSessionInfo() {
    const user = getCurrentUser();

    if (!user) return null;

    return {
        name: user.name,
        role: user.role,
        loginAt: user.loginAt
    };
}

/* ==========================================
   🧠 AUTO LOGIN DEMO (nice)
========================================== */
function ensureDemoUser() {
    if (!getCurrentUser()) {
        console.warn("⚠️ Ingen user → skapar demo admin");
        login("Admin", "admin");
    }
}
