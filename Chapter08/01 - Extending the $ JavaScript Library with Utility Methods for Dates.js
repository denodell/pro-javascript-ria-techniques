// Add the padZero method to the Utils namespace. This method returns the string 
// form of a number passed to it. If the number is less than 10, an extra 0 is 
// to added beginning of the resulting string 
$.prototype.Utils.padZero = function(number) { 
    return (number < 10 ? "0" : "") + number.toString(); 
} 

// Create a new namespace called Date for holding all date-specific utility methods 
$.prototype.Date = { 

    // The copy method duplicates a Date object and returns the copy. Typically, 
    // Dates are passed around in JavaScript as references to a single object, so 
    // normal variable copying is not possible - each copy would always point as 
    // a reference to the same object. This method creates a new Date object, 
    // taking the exact date and time from the existing object 
    copy: function(date) { 
        var newDate = new Date(); 
        newDate.setTime(date.valueOf()); 
        return newDate; 
    }, 
	
    // The add method takes an existing Date object and adds a specified number of 
    // days, months and years to that object, returning the resulting Date object 
    add: function(date, options) { 
        // The options object literal contains three properties - day, month and 
        // year - representing the number of each to add to the input Date object 
        var daysToAdd = options.day || 0; 
        var monthsToAdd = options.month || 0; 
        var yearsToAdd = options.year || 0; 
		
        // Create a new Date object and add the days, months and years 
        // specified to it 
        var date = this.copy(date);
		var initialDay = date.getDate(); 
        var initialMonth = date.getMonth(); 
        var initialYear = date.getFullYear(); 
        date.setFullYear(initialYear + yearsToAdd); 
        date.setMonth(initialMonth + monthsToAdd); 
        date.setDate(initialDay + daysToAdd); 
		
        // Return the resulting Date object 
        return date; 
    }, 
	
    // The matchDay method returns true if the two Date objects passed to it have 
    // the same day number - i.e., inputs of 28 May and 28 June would return true 
    // since the day number is the same for each 
    matchDay: function(date1, date2) { 
        return date1.getDate() == date2.getDate(); 
    }, 
	
    // The matchMonth method returns true if both Date objects passed to it occur 
    // within the same month and same year as each other 
    matchMonth: function(date1, date2) { 
        return ((date1.getMonth() == date2.getMonth()) && (date1.getFullYear() == date2.getFullYear())); 
    }, 
	
    // The match method returns true or false depending on whether the two Date 
    // objects input represent identical dates 
    match: function(date1, date2) { 
        return this.matchDay(date1, date2) && this.matchMonth(date1, date2); 
    }, 
	
    // The format method returns a date as a user-friendly formatted string 
    format: function(date, formatDefinition, dayName, monthName) { 
        var d = date.getDate(); // Single or double digit day 
        var dd = $.Utils.padZero(d); // Double digit day 
        var dddd = dayName; // Day name 
        var ddd = dddd.substr(0, 3); // Short day name 
        var m = date.getMonth(); // Single or double digit month 
        var mm = $.Utils.padZero(m); // Double digit month 
        var mmmm = monthName; // Full month name 
        var mmm = mmmm.substr(0, 3); // Short month name 
        var yy = $.Utils.padZero(date.getYear()); // Two digit year 
        var yyyy = date.getFullYear(); // Four digit year 
        var tttt = date.getTime(); // Date represented as time
        
		return $.Utils.replaceText(formatDefinition, { 
            d: d, 
            dd: dd, 
            ddd: ddd, 
            dddd: dddd, 
            m: m, 
            mm: mm, 
            mmm: mmm, 
            mmmm: mmmm, 
            yy: yy, 
            yyyy: yyyy, 
            tttt: tttt 
        }) 
    }, 
	
    // The getStartOfFirstWeekInMonthSquare method returns the Date object 
    // representing the first day of a month square. This is usually the day before 
    // the first of the month, which occurs on a Sunday in JavaScript, allowing a 
    // calendar to display dates that fit into a neat date square, including dates 
    // that occur in the previous month 
    getStartOfFirstWeekInMonthSquare: function(date) { 
        date = this.copy(date); 
        date.setDate(1); // First day in month 
        date.setDate(1 - date.getDay()); // Go back to Sunday at start of week 
        return date; 
    }, 
	
    // The getEndOfWeekInMonthSquare method returns the last date that would fit 
    // into a neat month square around the month represented in the date 
    // input parameter 
    getEndOfWeekInMonthSquare: function(date, weeksInSquare) { 
        var DAYS_IN_WEEK = 7; 
		
        date = this.copy(date); 
        date.setDate(1); 
        date = this.add(date, { 
            month: 1 
        }); 
		
        // Go back to the last day of the month 
        date.setDate(date.getDate() - 1);
		
		// Look forward to last day of month square 
        var numberOfDaysToEndOfWeek = (DAYS_IN_WEEK - 1) - date.getDay(); 
        date = this.add(date, { 
            day: numberOfDaysToEndOfWeek 
        }); 
		
        return date; 
    } 
}