/* ==========================================
   📅 CALENDAR FEATURE
   Ansvar:
   - Rendera kalendern
   - Mappa data → events
   - Hantera UI-interaktion (drag, resize, delete)
========================================== */

let calendar; // håller referens till aktuell kalender-instans

/* ==========================================
   🎯 PUBLIC: Render Calendar
   - Hämtar data
   - Bygger events
   - Initierar FullCalendar
========================================== */
window.renderCalendar = function () {
    const employees = getEmployees();   // 🔹 alla anställda
    const vacations = getVacations();   // 🔹 alla semestrar

    // 🔹 valt filter (eller "all")
    const filter = document.getElementById("filter")?.value || "all";

    /* ------------------------------------------
       🔄 Transformera vacations → calendar events
    ------------------------------------------ */
    const events = vacations
        .filter(v => filter === "all" || v.employee_id == filter)
        .map(v => {
            const emp = employees.find(e => e.id == v.employee_id);

            return {
                id: v.id,
                title: emp?.name || "?",          // fallback om employee saknas
                start: v.start,
                end: v.end,
                backgroundColor: emp?.color || "#1677ff"
            };
        });

    /* ------------------------------------------
       ♻️ Rensa tidigare kalender (om finns)
    ------------------------------------------ */
    if (calendar) {
        calendar.destroy();
    }

    /* ------------------------------------------
       📅 Initiera FullCalendar
    ------------------------------------------ */
    calendar = new FullCalendar.Calendar(
        document.getElementById("calendar"),
        {
            initialView: "dayGridMonth",

            // 🔥 tillåter drag & resize
            editable: true,

            // 🔹 events som ska visas
            events: events,

            /* ----------------------------------
               🖱️ EVENT: Drag & Drop
            ---------------------------------- */
            eventDrop: function (info) {
                handleUpdateEvent(info.event);
            },

            /* ----------------------------------
               📏 EVENT: Resize (ändra längd)
            ---------------------------------- */
            eventResize: function (info) {
                handleUpdateEvent(info.event);
            },

            /* ----------------------------------
               ❌ EVENT: Klick → delete (admin)
            ---------------------------------- */
            eventClick: function (info) {
                if (!isAdmin()) {
                    alert("Endast admin kan ta bort");
                    return;
                }

                if (confirm("Ta bort?")) {
                    handleDeleteEvent(info.event.id);
                }
            }
        }
    );

    calendar.render();
};

/* ==========================================
   🔄 UPDATE EVENT
   - Uppdaterar semester efter drag/resize
========================================== */
function handleUpdateEvent(event) {
    const vacations = getVacations();

    const updated = vacations.map(v => {
        if (v.id == event.id) {
            return {
                ...v,
                start: event.startStr,
                end: event.endStr
            };
        }
        return v;
    });

    saveVacations(updated);
}

/* ==========================================
   ❌ DELETE EVENT
   - Tar bort semester
   - Re-renderar kalender
========================================== */
function handleDeleteEvent(id) {
    const vacations = getVacations();

    const filtered = vacations.filter(v => v.id != id);

    saveVacations(filtered);

    // 🔁 uppdatera UI efter delete
    renderCalendar();
}
