// Create the constructor that will represent our calendar form control. The inputs 
// are contained within the options object literal, which should contain 
// three properties: 
// - destinationElement: the DOM element on the page within which to insert 
//       the calendar form control 
// - selectedDate: a JavaScript Date object representing the default selected date 
//       on the calendar 
// - strings: an object literal containing text strings to allow for localization of 
//       the calendar form control, including day and month names and text for 
//       'previous' and 'next' button labels to change the currently displayed month 

var Calendar = function(options) { 

    // Store the list of events supported by the calendar, according to the 
    // Observer pattern 
    this.eventType = { 
	
        // The INITIALIZE event will be fired once the calendar is instantiated 
        INITIALIZE: 0, 
		
        // The READY event will be fired once the currently selected date has been 
        // established after instantiation 
        READY: 1, 
		
        // The HTML_RENDERED event will be fired as soon as the calendar control is 
        // rendered onto the page 
        HTML_RENDERED: 2,
		
		// The INCREMENT_DISPLAY_MONTH event will be fired when the users indicate 
        // they wish to display the next month forward from the currently 
        // displayed month 
        INCREMENT_DISPLAY_MONTH: 3, 
		
        // The DECREMENT_DISPLAY_MONTH event will be fired when the users indicate 
        // they wish to display the previous month before the currently 
        // displayed month 
        DECREMENT_DISPLAY_MONTH: 4, 
		
        // The MONTH_CHANGED event will be fired once the currently displayed month 
        // value has been changed, so that the UI can be updated to 
        // reflect the new month 
        MONTH_CHANGED: 5, 
		
        // The DATE_SELECTED event will be fired when the users indicate they 
        // wish to select a new date from the calendar control. The new date value 
        // is passed along with the event 
        DATE_SELECTED: 6 
    } 
	
    // The initialize self-instantiating function creates instances of the two code 
    // blocks in the system and fires the first event of the system, the INITIALIZE 
    // event, to kick off proceedings 
    var initialize = function(options) { 
	
        // Data storage and manipulation code will be represented by the Data code 
        // block, defined later. We instantiate the code block but do not need to 
        // assign it to a variable here, since it is completely self contained. 
        new this.Data(options, this); 
		
        // User interface and interaction code will be represented within the UI 
        // code block, also defined later 
        new this.UI(options, this); 
		
        // Now that the code blocks and event list have been initialized, fire the 
        // INITIALIZE event. The Data and UI code blocks can listen for this event 
        // and act appropriately to initialize their own code 
        this.fire(this.eventType.INITIALIZE); 
    }.call(this, options); 
} 

// Add support for the Observer pattern's listen and fire events to the calendar 
Calendar.prototype = new $.Observer; 

// The Data code block is a constructor and contains code to store and manipulate 
// data within the calendar, primarily representing the currently selected date and
// the currently displayed month on the calendar control. When it is instantiated, 
// the object literal's inputs to the calendar are passed in, along with a reference 
// to the parent object, the Calendar class, from which the code block can utilize 
// the events list and Observer methods listen and fire. 
Calendar.prototype.Data = function(options, thisCalendar) { 

    // Store three properties representing the master Calendar instance that 
    // instantiated Data, the currently selected date, and the currently 
    // displayed month 
    this.thisCalendar = this; 
    this.selectedDate = null; 
    this.displayMonth = null; 
	
    // We create getter and setter methods to protect these properties and ensure 
    // sensible data gets written to them 
	
    // The getDisplayMonth method returns a copy of the JavaScript Date object that 
    // represents the currently displayed month within the control 
    this.getDisplayMonth = function() { 
        return $.Date.copy(this.displayMonth); 
    } 
	
    // The setDisplayMonth method sets the currently displayed month to the passed 
    // in month, if it exists, or sets it to the current date if it is not supplied 
    this.setDisplayMonth = function(date) { 
        this.displayMonth = $.Date.copy(date) || new Date(); 
        // We only care about the month, not the specific day for this variable. Set 
        // the day to the 1st of the month to avoid any problems jumping 
        // between months 
        this.displayMonth.setDate(1); 
		
        // Allow chaining of method calls by returning this 
        return this; 
    } 
	
    // The getSelectedDate method returns a copy of the JavaScript Date object 
    // representing the currently selected date on the calendar 
    this.getSelectedDate = function() { 
        return $.Date.copy(this.selectedDate); 
    } 
	
    // The setSelectedDate method sets the currently selected date to the value 
    // passed into the method, if one is provided. If it is not, the current date is 
    // used instead 
    this.setSelectedDate = function(date) { 
        this.selectedDate = $.Date.copy(date) || new Date(); 
        return this; 
    }
	
	// The getCalendarInstance method returns the reference to the master Calendar 
    // instance that instantiated the Data code block. We need this to be able to 
    // access the Observer pattern methods and events list used in the whole system 
    this.getCalendarInstance = function() { 
        return this.thisCalendar; 
    } 
	
    // The setCalendarInstance method sets the current Calendar object instance to 
    // the value passed into the method. If a value is not passed in, we use the 
    // current object scope instead 
    this.setCalendarInstance = function(thisCalendar) { 
        this.thisCalendar = thisCalendar || this; 
        return this; 
    } 
	
    // With the getters and setters complete, we define our methods to manipulate 
    // the dates as required by the system 
	
    // The incrementDisplayMonth method adds one month to the displayMonth property, 
    // then fires the MONTH_CHANGED event to notify the entire calendar control 
    // that the value has changed, in case the code needs to react to this event 
    this.incrementDisplayMonth = function() { 
        this.setDisplayMonth($.Date.add(this.getDisplayMonth(), { 
            month: 1 
        })); 
		
        var thisCalendar = this.getCalendarInstance(); 
        var eventType = thisCalendar.eventType; 
		
        // Pass the new display month and currently selected date to any code block 
        // in the calendar control listening for the MONTH_CHANGED event 
        thisCalendar.fire(eventType.MONTH_CHANGED, { 
            displayMonth: this.getDisplayMonth(), 
            selectedDate: this.getSelectedDate() 
        }); 
    } 
	
    // The decrementDisplayMonth method subtracts one month from the displayMonth 
    // property,then fires the MONTH_CHANGED event to notify other code blocks that 
    // the display month has been altered 
    this.decrementDisplayMonth = function() { 
        this.setDisplayMonth($.Date.add(this.getDisplayMonth(), { 
            month: -1 
        })); 
		
        var thisCalendar = this.getCalendarInstance(); 
        var eventType = thisCalendar.eventType;
		
		thisCalendar.fire(eventType.MONTH_CHANGED, { 
            displayMonth: this.getDisplayMonth(), 
            selectedDate: this.getSelectedDate() 
        }); 
    } 
	
    // The addObservers method assigns functions to execute when certain events 
    // are fired within the calendar control, either by the current code block or 
    // by others 
    this.addObservers = function() { 
        var self = this; 
        var thisCalendar = this.getCalendarInstance(); 
        var eventType = thisCalendar.eventType; 
		
        // Listen for the INITIALIZE event being fired, then fire the READY event 
        // immediately, passing it the current month to display and the currently 
        // selected date. The master Calendar instance will fire the INITIALIZE 
        // event once it has instantiated this code block 
        thisCalendar.listen(eventType.INITIALIZE, function() { 
            thisCalendar.fire(eventType.READY, { 
                displayMonth: self.getDisplayMonth(), 
                selectedDate: self.getSelectedDate() 
            }); 
        }); 
		
        // Listen for the INCREMENT_DISPLAY_MONTH event to fire, and increment the 
        // date stored in the displayMonth property accordingly when it is fired 
        thisCalendar.listen(eventType.INCREMENT_DISPLAY_MONTH, function() { 
            self.incrementDisplayMonth(); 
        }); 
		
        // Listen for the DECREMENT_DISPLAY_MONTH event to fire, and decrement the 
        // displayMonth date property when it occurs 
        thisCalendar.listen(eventType.DECREMENT_DISPLAY_MONTH, function(){ 
            self.decrementDisplayMonth(); 
        }); 
		
        // Listen for the DATE_SELECTED event and store the passed in JavaScript 
        // Date object as the newly selected date and update the displayMonth 
        // property according to the month of the newly selected date 
        thisCalendar.listen(eventType.DATE_SELECTED, function(selectedDate) { 
            self.setSelectedDate(selectedDate); 
            self.setDisplayMonth(selectedDate); 
        }); 
		
        return this; 
    };
	
	// Initialize the Data code block, storing the passed in properties and 
    // beginning to listen for events fired in the system 
    var initialize = function(options, thisCalendar){ 
        this 
            .setCalendarInstance(thisCalendar) 
            .setSelectedDate(options.selectedDate) 
            .setDisplayMonth(options.selectedDate) 
            .addObservers(); 
    }.call(this, options, thisCalendar); 
}; 

// The UI code block is a constructor and contains code to display and allow 
// interaction with the visible calendar control on the page. This code block is 
// completely separate from the Data code block defined previously, but relies 
// on the same set of events being fired within the control, according to 
// the Observer pattern 
Calendar.prototype.UI = function(options, thisCalendar) { 

    // Define three properties for this code block: a reference to the master 
    // Calendar instance which will instantiate this code block, the destination 
    // DOM element to place the calendar control within, and an object literal 
    // containing the text strings to use for day and month names, along with 
    // the text for 'previous' and 'next' buttons 
    this.thisCalendar = this; 
    this.destinationElement = $.Elements.create("div"); 
    this.strings = { 
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], 
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], 
        previous: 'Previous', 
        next: 'Next' 
    } 
	
    // We now declare a series of getter and setter methods to protect access to 
    // these properties, ensuring they always have real values contained within them 
	
    this.getCalendarInstance = function() { 
        return this.thisCalendar; 
    } 
	
    this.setCalendarInstance = function(thisCalendar) { 
        this.thisCalendar = thisCalendar || this; 
        return this; 
    }
	
	// The getDestinationElement method returns the destinationElement property 
    this.getDestinationElement = function() { 
        return this.destinationElement; 
    } 
	
    // The setDestinationElement method sets the destinationElement property to the 
    // passed in value, or creates a new element from scratch if one is not supplied 
    this.setDestinationElement = function(element) { 
        this.destinationElement = element || $.Elements.create("div"); 
        return this; 
    } 
	
    // The getLanguageStrings method returns the strings property for use 
    // within the calendar 
    this.getLanguageStrings = function() { 
        return this.strings; 
    } 
	
    // The setLanguageStrings method combines a supplied object literal with the 
    // current strings object literal property, overriding existing values with 
    // those supplied with an identical property name 
    this.setLanguageStrings = function(languageStrings) { 
        this.strings = $.Utils.mergeObjects(this.strings, languageStrings); 
        return this; 
    } 
	
    // The getDayNameByDay method expects a number representing the day of the week 
    // (0 = Sunday, 6 = Saturday) and returns, from the strings object literal, the 
    // day name that corresponds with that weekday 
    this.getDayNameByDay = function(day) { 
        return this.getLanguageStrings().days[day]; 
    } 
	
    // The getDayName method returns the weekday name for a supplied JavaScript Date 
    // object, using the strings object literal property 
    this.getDayName = function(date) { 
        return this.getDayNameByDay(date.getDay()); 
    } 
	
    // The getMonthNameByMonth method expects a number representing a month 
    // (0 = January, 11 = December) and returns the name of the month corresponding 
    // to that month from the string object literal property 
    this.getMonthNameByMonth = function(month) { 
        return this.getLanguageStrings().months[month]; 
    } 
	
    // The getMonthName method returns the month name for a supplied JavaScript Date 
    // object, using the names stored in the strings object literal property
	this.getMonthName = function(date) { 
        return this.getMonthNameByMonth(date.getMonth()); 
    } 
    // The applyStyle method sets a class on the destinationElement to allow us to 
    // use CSS to style the calendar control correctly 
    this.applyStyle = function() { 
        $.CSS.addClass(this.getDestinationElement(), "cal-container"); 
        return this; 
    } 
	
    // The getHeadingElement method returns a DOM element displaying the month 
    // and year of the currently displayed month for inclusion at the top of the 
    // calendar control 
    this.getHeadingElement = function(displayMonth) { 
	
        // Create a paragraph tag and format the currently displayed month by its 
        // full month name and year 
        var p = $.Elements.create("p"); 
        p.innerHTML = $.Date.format(displayMonth, "{mmmm} {yyyy}", "", this.getMonthName(displayMonth)); 
		
        // Return this new paragraph tag. It will be added to the control at 
        // a later stage 
        return p; 
    } 
	
    // The getMonthNavigatorElement creates and returns the DOM elements which will 
    // allow the user to navigate forward and backward through the months in order 
    // to select a different date 
    this.getMonthNavigatorElement = function() { 
	
        // Create an ordered list element to contain the previous and next buttons 
        // within two list items 
        var ul = $.Elements.create("ul"); 
		
        // Create the list item and link which will act as the previous button to 
        // take the user's calendar view back one month without selecting a 
        // new date on the calendar itself 
        var liPrevious = $.Elements.create("li"); 
        liPrevious.className = "cal-previous"; 
        var aPrevious = $.Elements.create("a"); 
        aPrevious.className = "cal-btn-previous"; 
        aPrevious.title = this.getLanguageStrings().previous; 
        aPrevious.innerHTML = this.getLanguageStrings().previous; 
        liPrevious.appendChild(aPrevious);
		
		// Create the list item and link which will act as the next button to take 
        // the user forward one month 
        var liNext = $.Elements.create("li"); 
        liNext.className = "cal-next"; 
        var aNext = $.Elements.create("a"); 
        aNext.className = "cal-btn-next"; 
        aNext.title = this.getLanguageStrings().next; 
        aNext.innerHTML = this.getLanguageStrings().next; 
        liNext.appendChild(aNext); 
		
        ul.appendChild(liPrevious); 
        ul.appendChild(liNext); 
		
        // Return the list item representing this month navigator. It will be added 
        // to the calendar control later 
        return ul; 
    } 
	
    // The getCalendarElement method creates the actual calendar element as 
    // a <table> tag 
    this.getCalendarElement = function(displayMonth, selectedDate) { 
        var DAYS_IN_WEEK = 7; 
		
        // No month can cross more than 6 weeks, so we'll render all months with 
        // 6 weeks. We will display dates that fall outside the current date using a 
        // different style to differentiate them from the current month but still 
        // allow them to be selectable, giving the user the chance to select dates 
        // that are not in the current month but fall a few days either side 
        var WEEKS_TO_SHOW = 6; 
		
        // Get the first day to display in this 6-week month block 
        var dateDisplay = $.Date.getStartOfFirstWeekInMonthSquare(displayMonth); 
		
        // Create a <table> element to house the calendar 
        var table = $.Elements.create("table"); 
        table.cellpadding = "0"; 
		
        // Create the header cells for the table, which will display the name of 
        // each day of the week 
        var thead = $.Elements.create("thead"); 
        var tr = $.Elements.create("tr"); 
        for (var day = 0, totalDays = DAYS_IN_WEEK; day < totalDays; day++) { 
            var th = $.Elements.create("th"); 
			
            // Format the title attribute to be the full name of the day of the week 
            th.title = $.Date.format(new Date(), "{dddd}", this.getDayNameByDay(day), "");
			
			// Format the displayed text to be the shortened form of the weekday 
            // name, to save on space 
            th.innerHTML = $.Date.format(new Date(), "{ddd}", this.getDayNameByDay(day), ""); 
            tr.appendChild(th); 
        } 
        thead.appendChild(tr);
		
        // Create the cells representing each day of the 6-week month block 
        var tbody = $.Elements.create("tbody"); 
		
        // Loop through the weeks on display 
        for (var week = 0, totalWeeks = WEEKS_TO_SHOW; week < totalWeeks; week++) { 
		
            // Each week is represented by a row in the table 
            var tr = $.Elements.create("tr"); 
			
            // Loop through the days in each week 
            for (var day = 0, totalDays = DAYS_IN_WEEK; day < totalDays; day++) { 
			
                // Establish if the current date in the loop exists within the 
                // currently displayed month 
                var isCurrentDisplayedMonth = $.Date.matchMonth(displayMonth, dateDisplay); 
				
                // Establish if the current date in the loop matches the 
                // currently selected date 
                var isSelectedDate = $.Date.match(selectedDate, dateDisplay); 
				
                // Represent the current date in the loop as a table cell with 
                // a link inside 
                var td = $.Elements.create("td"); 
				
                // The title attribute of the table cell contains the full date, 
                // e.g., Thursday 14 May 2009 
                td.title = $.Date.format(dateDisplay, "{dddd} {d} {mmmm} {yyyy}", this.getDayName(dateDisplay), this.getMonthName(dateDisplay)); 
				
                // Set the class of the table cell correctly, denoting if the 
                // current date is selected or if it is in the current 
                // month or one of the neighboring months 
                td.className = isSelectedDate ? (isCurrentDisplayedMonth ? "cal-selected-date" :  "cal-different-month cal-selected-date") : (isCurrentDisplayedMonth ? "cal-current-month"  
:"cal-different-month"); 

                // Create a link element to display the date within 
                var a = $.Elements.create("a");
				
				// Set the class of the link element 
                a.className = $.Date.format(dateDisplay, "cal-btn-day  day-{d}", this.getDayName(dateDisplay), this.getMonthName(dateDisplay)); 
				
                // Create a new custom attribute to store the current date as a 
                // string representing the JavaScript Date object - this is so that 
                // we can retrieve the date again later 
                a.setAttribute("datetime", $.Date.format(dateDisplay, "{tttt}", this.getDayName(dateDisplay), this.getMonthName(dateDisplay))); 
				
                // Set the text within the link to display the date number of 
                // the current date 
                a.innerHTML = $.Date.format(dateDisplay, "{d}", this.getDayName(dateDisplay), this.getMonthName(dateDisplay)); 
				
                // Add the link to the table cell and table cell to the table row 
                td.appendChild(a); 
                tr.appendChild(td); 
				
                // Increment the date in the loop by one day for the next iteration 
                dateDisplay = $.Date.add(dateDisplay, { 
                    day: 1 
                }); 
            } 
			
            // Add the table row to the <tbody> tag 
            tbody.appendChild(tr); 
        } 
		
        // Add the header and body of the table to the <table> element itself 
        table.appendChild(thead); 
        table.appendChild(tbody); 
		
        // Return the fully populated <table> element for adding to the 
        // calendar control 
        return table; 
    } 
	
    // The render method constructs the calendar control from supplied values for 
    // the currently displayed month and currently selected date, then adds it to 
    // the page within the specified DOM element 
    this.render = function(dates) { 
        var displayMonth = dates.displayMonth; 
        var selectedDate = dates.selectedDate;
		
		// Use DocumentFragment objects for performance efficiency, 
        // as described in Chapter 4 
        var miniDOM = document.createDocumentFragment(); 
        miniDOM.appendChild(this.getHeadingElement(displayMonth)); 
        miniDOM.appendChild(this.getMonthNavigatorElement()); 
        miniDOM.appendChild(this.getCalendarElement(displayMonth, selectedDate)); 
		
        // Clear out any elements already within the DOM element container 
        this.destinationElement.innerHTML = ""; 
		
        // Add the calendar control to the page 
        this.getDestinationElement().appendChild(miniDOM.cloneNode(true)); 
		
        return this; 
    } 
	
    // The wireUpUserEvents method listens for mouse clicks occurring within 
    // the calendar control 
    this.wireUpUserEvents = function() { 
        var self = this; 
		
        $.Events.add(this.getDestinationElement(), "click", function(e) { 
            // Stop the default click action of the element being selected 
            e.preventDefault(); 
			
            // Execute the clickEvent method whenever the user selects something 
            // within the calendar control 
            self.clickEvent(e); 
        }); 
    } 
	
    // The clickEvent method is fired when the user clicks within the calendar 
    // control and is used to either select a different month to be 
    // displayed or to select a new date from the calendar 
    this.clickEvent = function(e) { 
        var thisCalendar = this.getCalendarInstance(); 
        var eventType = thisCalendar.eventType; 
		
        // Based on which element was clicked, we will fire calendar-wide 
        // events using the Observer pattern 
        if ($.CSS.hasClass(e.target,  "cal-btn-previous")) { 
		
            // If the user clicks the previous button in the month navigator, 
            // then fire the DECREMENT_DISPLAY_MONTH event - we define 
            // the behavior of that event later 
            thisCalendar.fire(eventType.DECREMENT_DISPLAY_MONTH); 
        } else if ($.CSS.hasClass(e.target, "cal-btn-next")) {

			// If the user clicks the next button in the month navigator, fire the 
            // INCREMENT_DISPLAY_MONTH event 
            thisCalendar.fire(eventType.INCREMENT_DISPLAY_MONTH); 
        } else if ($.CSS.hasClass(e.target, "cal-btn-day")) { 
		
            // If the user clicks a specific date within the calendar, we extract 
            // the date from the datetime attribute we stored previously, then 
            // fire the DATE_SELECTED event, passing it the selected 
            // date as a JavaScript Date object 
            var newlySelectedDate = new Date(); 
            newlySelectedDate.setTime(e.target.getAttribute("datetime")); 
            thisCalendar.fire(eventType.DATE_SELECTED, newlySelectedDate); 
        } 
    } 
	
    // The addObservers method assigns methods to fire when certain events fire in 
    // the control, according to the Observer pattern 
    this.addObservers = function() { 
        var self = this; 
        var thisCalendar = this.getCalendarInstance(); 
        var eventType = this.getCalendarInstance().eventType; 
		
        // Listen for the READY event, which passes across the current month to 
        // display and the currently selected date, and use this data to render the 
        // calendar control on the page. Once rendered, fire the 
        // HTML_RENDERED event 
        thisCalendar.listen(eventType.READY, function(dates) { 
            self.render(dates); 
            thisCalendar.fire(eventType.HTML_RENDERED); 
        }); 
		
        // Listen for the HTML_RENDERED event and set the appropriate class for 
        // applying the correct styling to the calendar control. Also, connect up 
        // browser events to detect when buttons and dates are selected 
        // within the control 
        thisCalendar.listen(eventType.HTML_RENDERED, function() { 
            self.applyStyle(); 
            self.wireUpUserEvents(); 
        }); 
		
        // Listen for the MONTH_CHANGED event and re-render the control using the 
        // new display and selected dates 
        thisCalendar.listen(eventType.MONTH_CHANGED, function(dates) { 
            self.render(dates); 
        });
		
		// Listen for the DATE_SELECTED event, re-rendering the control using 
        // the currently selected date. The display date will be set to the same as 
        // the selected date so that, when selected, the selected month becomes 
        // the month currently displayed - useful if the user clicks on one of the 
        // dates that lies just outside the current month within the control 
        thisCalendar.listen(eventType.DATE_SELECTED, function(selectedDate) { 
            self.render({ 
                displayMonth: selectedDate, 
                selectedDate: selectedDate 
            }); 
        }); 
		
        return this; 
    } 
	
    // The initialize self-instantiating function stores the relevant values passed 
    // in and begins listening for events fired within the control, according to 
    // the Observer pattern 
    var initialize = function(options, thisCalendar) { 
        this 
            .setCalendarInstance(thisCalendar) 
            .setDestinationElement(options.destinationElement) 
            .setLanguageStrings(options.strings) 
            .addObservers(); 
			
        return this; 
    }(options, thisCalendar); 
}; 