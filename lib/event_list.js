module.exports = function(event_list) {
	return event_list.items.map(function(calendarEvent) {
		// Note: timezone for an event is found in the containing calendar, not within the event.   
		return {
			id: calendarEvent.id,
			status: calendarEvent.status,
			title: calendarEvent.summary,
			start: {
				dateTime: calendarEvent.start.dateTime,
				timezone: event_list.timeZone
			},
			end: {
				dateTime: calendarEvent.end.dateTime,
				timezone: event_list.timeZone
			},
			location: calendarEvent.location,
			attendees: calendarEvent.attendees,
			organizer: calendarEvent.organizer,
			recurrence: calendarEvent.recurrence
		};
	});
}
