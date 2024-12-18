document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const extendedCalendarEl = document.getElementById('extended-calendar');
    const selectedDateEl = document.getElementById('selected-date');
    const extendedCalendarModalEl = document.getElementById('extendedCalendarModal').querySelector('#extended-calendar');
  
  
    document.getElementById('sarah').checked = true;
  
    // Set initial date
    const today = new Date();
    let currentDate = today;
  
    // Mock appointments (ensure this is declared before `renderAppointments`)
    const appointments = [
      {
        date: today.toISOString().split('T')[0],
        time: '08:00:00', // Start time
        endTime: '09:00:00', // End time
        type: 'Consultation',
        patient: 'John Doe',
      },
      {
        date: today.toISOString().split('T')[0],
        time: '11:00:00',
        endTime: '12:00:00',
        type: 'Checkup',
        patient: 'Jane Smith',
      },
      {
        date: today.toISOString().split('T')[0],
        time: '18:00:00',
        endTime: '19:00:00',
        type: 'Follow-Up',
        patient: 'Robert Brown',
      },
    ];
  
    // Helper function to format dates
    const formatDate = (date) =>
      date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  
    // Initialize Normal Calendar (Month View)
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'customPrev',
        center: 'title',
        right: 'customNext'
      },
      height: 'auto',
      fixedWeekCount: false,
      dayMaxEvents: 1,
      showNonCurrentDates: true,
      titleFormat: { month: 'long' },
      firstDay: 1,
      customButtons: {
        customPrev: {
          text: '', // Leave empty if using an image
          click: function () {
            calendar.prev();
          },
        },
        customNext: {
          text: '', // Leave empty if using an image
          click: function () {
            calendar.next();
          },
        }
      },
      dayHeaderContent: function (info) {
        const dayAbbreviations = {
          Sun: 'S',
          Mon: 'M',
          Tue: 'T',
          Wed: 'W',
          Thu: 'T',
          Fri: 'F',
          Sat: 'S',
        };
        return dayAbbreviations[info.text];
      },
  
      // When a date is clicked, update the extended calendar
      dateClick: function (info) {
        currentDate = info.date; // Set currentDate
        updateSelectedDate(); // Update selected date display
        extendedCalendar.gotoDate(currentDate); // Sync extended calendar
  
        // Handle mobile view modal
        if (window.innerWidth < 768) {
          const extendedCalendarModal = new bootstrap.Modal(document.getElementById('extendedCalendarModal'));
          extendedCalendarModal.show();
        }
      },
    });
  
    // Map appointments to FullCalendar events
    const events = appointments.map((appointment) => ({
      title: `${appointment.type} - ${appointment.patient}`,
      start: `${appointment.date}T${appointment.time}`, // Combine date and time
      end: `${appointment.date}T${appointment.endTime}`,
      extendedProps: {
        type: appointment.type,
        patient: appointment.patient,
      },
    }));
  
    // Initialize Extended Calendar (Day View)
    const extendedCalendar = new FullCalendar.Calendar(extendedCalendarEl, {
      initialView: 'timeGridDay',
      timeZone: 'local',
      initialDate: today,
      headerToolbar: false,
      dayHeaders: false, // Removes day headers
      allDaySlot: false, // Removes the all-day row
      slotMinTime: '05:00:00',
      dateClick: function (info) {
        currentDate = info.date;
        updateSelectedDate();
      },
      events: events,
      viewDidMount: function (view) {
        // Enable day headers only for week view
        if (view.view.type === 'timeGridWeek') {
          view.view.calendar.setOption('dayHeaders', true);
        } else {
          view.view.calendar.setOption('dayHeaders', false);
        }
      }, // Load events into the calendar
      eventContent: function (arg) {
        let modalTarget = '';
  
        // Determine modal based on event type
        switch (arg.event.extendedProps.type) {
          case 'Consultation':
            modalTarget = '#viewAppointmentDetailsModal';
            break;
          case 'Checkup':
            modalTarget = '#viewAppointmentPaidDetailsModal';
            break;
          case 'Follow-Up':
            modalTarget = '#viewAppointmentDetailsModal';
            break;
          default:
            modalTarget = '#viewAppointmentDetailsModal';
        }
  
        return {
          html: `
      <div class="custom-event" 
           data-bs-toggle="modal" 
           data-bs-target="${modalTarget}"
           data-event-id="${arg.event.id}">
        <div class="event-type">${arg.event.extendedProps.type}</div>
        <div class="event-patient">${arg.event.extendedProps.patient}</div>
        <div class="event-time">
          ${arg.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
          ${arg.event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    `
        };
      }
    });
    const extendedCalendarModal = new FullCalendar.Calendar(extendedCalendarModalEl, {
      initialView: 'timeGridDay',
      timeZone: 'local',
      initialDate: today,
      headerToolbar: false,
      dayHeaders: false, // Removes day headers
      allDaySlot: false, // Removes the all-day row
      slotMinTime: '05:00:00',
      dateClick: function (info) {
        currentDate = info.date;
        updateSelectedDate();
      },
      events: events,
      eventContent: function (arg) {
        let modalTarget = '';
        console.log('Event content for:', arg.event);
  
        // Determine modal based on event type
        switch (arg.event.extendedProps.type) {
          case 'Consultation':
            modalTarget = '#viewAppointmentDetailsModal';
            break;
          case 'Checkup':
            modalTarget = '#viewAppointmentPaidDetailsModal';
            break;
          case 'Follow-Up':
            modalTarget = '#viewAppointmentDetailsModal';
            break;
          default:
            modalTarget = '#viewAppointmentDetailsModal';
        }
  
        return {
          html: `
            <div class="custom-event" 
                 data-bs-toggle="modal" 
                 data-bs-target="${modalTarget}"
                 data-event-id="${arg.event.id}">
              <div class="event-type">${arg.event.extendedProps.type}</div>
              <div class="event-patient">${arg.event.extendedProps.patient}</div>
              <div class="event-time">
                ${arg.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                ${arg.event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          `
        };
      },
      viewDidMount: function (view) {
        // Enable day headers only for week view
        if (view.view.type === 'timeGridWeek') {
          view.view.calendar.setOption('dayHeaders', true);
        } else {
          view.view.calendar.setOption('dayHeaders', false);
        }
      }
    });
  
    // Event listener to render calendar when modal opens
    const extendedCalendarModalInstance = document.getElementById('extendedCalendarModal');
    extendedCalendarModalInstance.addEventListener('shown.bs.modal', function () {
      extendedCalendarModal.gotoDate(currentDate);
      extendedCalendarModal.render(); // Make sure the calendar is rendered after modal is fully shown
    });
  
  
    // Update selected date display and sync calendars
    const updateSelectedDate = () => {
      // Format for day (e.g., "Thu")
      const dayElement = document.querySelector('.calendar-head .day');
      dayElement.textContent = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
  
      // Format for date number (e.g., "16")
      const dateContainer = document.querySelector('.date-container');
      dateContainer.textContent = currentDate.getDate();
  
      selectedDateEl.textContent = formatDate(currentDate);
      extendedCalendar.gotoDate(currentDate);
  
      // Update modal content if exists
      const modalDayElement = document.querySelector('#extendedCalendarModal .calendar-head .day');
      const modalDateContainer = document.querySelector('#extendedCalendarModal .date-container');
  
      if (modalDayElement) {
        modalDayElement.textContent = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
      }
      if (modalDateContainer) {
        modalDateContainer.textContent = currentDate.getDate();
      }
    };
  
  
    // Handle change in the extended calendar view
    document.querySelector('.calendar-dropdown .dropdown-menu').addEventListener('click', function (event) {
      event.preventDefault(); // Prevent default link behavior if `<a>` is used
      const clickedItem = event.target;
  
      // Ensure the click was on a dropdown item
      if (clickedItem.classList.contains('dropdown-item')) {
        const selectedView = clickedItem.getAttribute('data-value'); // Get the view value (e.g., 'timeGridDay')
        const dropdownButton = document.getElementById('extendedCalendar-view-selector');
  
        // Update the dropdown button's text
        dropdownButton.textContent = clickedItem.textContent;
  
        // Change the calendar view
        extendedCalendar.changeView(selectedView);
  
        // Update the current date and re-render date display
        currentDate = extendedCalendar.getDate();
        updateSelectedDate();
  
        // Update selected state for the dropdown menu
        const dropdownItems = document.querySelectorAll('.calendar-dropdown .dropdown-item');
        dropdownItems.forEach((item) => item.classList.remove('selected')); // Remove 'selected' from all items
        clickedItem.classList.add('selected'); // Add 'selected' to the clicked item
      }
    });
  
    // Initial render
    calendar.render();
    extendedCalendar.render();
    updateSelectedDate();
  
  });
  
  document.addEventListener('DOMContentLoaded', function () {
    function formatTimeLabels(containerSelector) {
      const timeLabels = document.querySelectorAll(`${containerSelector} .fc-timegrid-slot-label-cushion`);
  
      timeLabels.forEach(label => {
        // Trim any extra spaces
        const timeText = label.textContent.trim();
  
        // Replace "am" or "pm" with " AM" or " PM" and add a space after the number
        const updatedText = timeText.replace(/(\d{1,2})(am|pm)/i, (match, hour, period) => {
          return `${hour} ${period.toUpperCase()}`;
        });
  
        label.innerHTML = updatedText;
      });
    }
  
    // Format time labels for both regular and modal calendars
    formatTimeLabels('#extended-calendar');
    formatTimeLabels('#extendedCalendarModal #extended-calendar');
  });