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

                backgroundColor: emp?.color || "#1677ff",

                // 🔥 NICE: tooltip
                extendedProps: {
                    employee: emp?.name || "Okänd"
                }
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

            editable: true,
            selectable: true,

            // 🔥 NICE: flera views
            headerToolbar: {
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
            },

            events: events,

            /* ----------------------------------
               🖱️ DRAG & DROP
            ---------------------------------- */
            eventDrop: function (info) {
                updateVacationById(info.event.id, {
                    start: info.event.startStr,
                    end: info.event.endStr
                });

                showToast?.("Flyttad", "info");
            },

            /* ----------------------------------
               📏 RESIZE
            ---------------------------------- */
            eventResize: function (info) {
                updateVacationById(info.event.id, {
                    start: info.event.startStr,
                    end: info.event.endStr
                });

                showToast?.("Uppdaterad längd", "info");
            },

            /* ----------------------------------
               ❌ CLICK
            ---------------------------------- */
            eventClick: function (info) {
                if (!isAdmin()) {
                    showToast?.("Endast admin", "error");
                    return;
                }

                const action = confirmAction?.(
                    "OK = Redigera\nAvbryt = Ta bort"
                );

                if (action) {
                    openEditVacationModal(info.event);
                } else {
                    if (!confirmAction?.("Ta bort?")) return;

                    deleteVacationById(info.event.id);
                    renderCalendar();

                    showToast?.("Borttagen", "info");
                }
            },

            /* ----------------------------------
               ✨ SELECT → CREATE
            ---------------------------------- */
            select: function (info) {
                handleCreateFromSelection(info);
            },

            /* ----------------------------------
               🔍 HOVER TOOLTIP (nice)
            ---------------------------------- */
            eventDidMount: function (info) {
                const employee = info.event.extendedProps.employee;

                info.el.title = `👤 ${employee}\n📅 ${info.event.startStr}`;
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
        showToast?.("Inga anställda finns", "error");
        return;
    }

    /* ------------------------------------------
       🧠 välj employee (enkel version)
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

    renderCalendar();

    showToast?.("Semester skapad", "success");
}
