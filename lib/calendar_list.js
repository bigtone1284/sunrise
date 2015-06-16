module.exports = function(calendar_list) {
	return calendar_list.map(function(calendar) {
		// Note: I have assumed that calendars with owner access are writable,
		// while calendars with reader access or other are not.  
		writable = calendar.accessRole === 'owner';
		return {
			id: calendar.id,
		  title: calendar.summary,
		  writable: writable,
		  selected: calendar.selected,
		  timezone: calendar.timeZone
		};
	});
};
