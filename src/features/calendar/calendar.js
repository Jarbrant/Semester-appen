/* ==========================================
   📅 CALENDAR FEATURE
   Ansvar:
   - Rendera kalendern
   - Mappa data → events
   - Hantera UI-interaktion (drag, resize, delete, select)
========================================== */

let calendar; // håller referens till aktuell kalender-instans

/* ==========================================
   🎯 PUBLIC: Render Calendar
========================================== */
window.renderCalendar = function () {
    const employees = getEmployees();
    const vacations = getVacations();

    const filter = document.getElementById("filter")?.value || "all";

    /* ------------------------------------------
       🔄 Transformera data → events
    ------------------------------------------ */
    const events = vacations
        .filter(v => filter === "all" || v.employee_id == filter)
        .map(v => {
            const emp = employees.find(e => e.id == v.employee_id);

            return {
                id: v.id,
                title: emp?.name || "?",
                start: v.start,
                end: v.end,
                backgroundColor: emp?.color || "#1677ff"
            };
        });

    /* ------------------------------------------
       ♻️ Rensa tidigare kalender
    ------------------------------------------ */
    if (calendar) {
        calendar.destroy();
    }

    /* ------------------------------------------
       📅 Initiera kalender
    ------------------------------------------ */
    calendar = new FullCalendar.Calendar(
        document.getElementById("calendar"),
        {
            initialView: "dayGridMonth",

            editable: true,     // drag & resize
            selectable: true,   // 🔥 select (ny feature)

            events: events,

            /* ----------------------------------
               🖱️ DRAG & DROP
            ---------------------------------- */
            eventDrop: function (info) {
                updateVacationById(info.event.id, {
                    start: info.event.startStr,
                    end: info.event.endStr
                });
            },

            /* ----------------------------------
               📏 RESIZE
            ---------------------------------- */
            eventResize: function (info) {
                updateVacationById(info.event.id, {
                    start: info.event.startStr,
                    end: info.event.endStr
                });
            },

            /* ----------------------------------
               ❌ DELETE
            ---------------------------------- */
            eventClick: function (info) {
                if (!isAdmin()) {
                    alert("Endast admin kan ta bort");
                    return;
                }

                if (confirm("Ta bort?")) {
                    deleteVacationById(info.event.id);
                    renderCalendar();
                }
            },

            /* ----------------------------------
               ✨ SELECT → CREATE VACATION
            ---------------------------------- */
            select: function (info) {
                handleCreateFromSelection(info);
            }
        }
    );

    calendar.render();
};

/* ==========================================
   ✨ CREATE FROM CALENDAR SELECT
========================================== */
function handleCreateFromSelection(info) {
    const employees = getEmployees();

    if (employees.length === 0) {
        alert("Inga anställda finns");
        return;
    }

    /* ------------------------------------------
       🧠 välj employee (enkel version)
       - senare kan du byta till modal
    ------------------------------------------ */
    const employeeOptions = employees
        .map(e => `${e.id}: ${e.name}`)
        .join("\n");

    const chosen = prompt(
        "Ange employee ID:\n" + employeeOptions
    );

    if (!chosen) return;

    /* ------------------------------------------
       📅 skapa semester
    ------------------------------------------ */
    const created = createVacation({
        employee_id: chosen,
        start: info.startStr,
        end: info.endStr
    });

    if (!created) return;

    /* ------------------------------------------
       🔄 uppdatera UI
    ------------------------------------------ */
    renderCalendar();
}
