// Add the Utils namespace to hold a set of useful, reusable methods 

$.prototype.Utils = { 

    // The mergeObjects method copies all the property values of one object 
    // literal into another, replacing any properties that already exist, and 
    // adding any that don't 
	
    mergeObjects: function(original, newObject) { 
        for (var key in newObject){ 
            // for ... in ... loops expose unwanted properties such as prototype 
            // and constructor, among others. Using the hasOwnProperty 
            // native method allows us to only allow real properties to pass
			if (newObject.hasOwnProperty(key)) { 
                // Loop through every item in the new object literal, 
                // getting the value of that item in the original object and 
                // the equivalent value in the original object, if it exists 
                var newPropertyValue = newObject[key]; 
                var originalPropertyValue = original[key]; 
            } 
            
            // Set the value in the original object to the equivalent value from the 
            // new object, except if the property's value is an object type, in 
            // which case call this method again recursively, in order to copy every 
            // value within that object literal also 
            original[key] = (originalPropertyValue && typeof newPropertyValue == 'object' && typeof originalPropertyValue == 'object') ? this.mergeObjects(originalPropertyValue, newPropertyValue) : newPropertyValue; 
        } 
		
        // Return the original object, with all properties copied over from 
        // the new object 
        return original; 
    }, 
	
    // The replaceText method takes a text string containing placeholder values and 
    // replaces those placeholders with actual values passed in through the values 
    // object literal. 
    // For example: "You have {count} messages in the {folderName} folder" 
    // Each placeholder, marked with braces – { } – will be replaced with the 
    // actual value from the values object literal, the properties count and 
    // folderName will be sought in this case 
	
    replaceText: function(text, values) { 
        for (var key in values) { 
            if (values.hasOwnProperty(key)) { 
                // Loop through all properties in the value object literal 
                if (typeof values[key] == undefined) { // Code defensively 
                    values[key] = ""; 
                } 
				
                // Replace the property name wrapped in braces from the text 
                // string with the actual value of that property. The regular 
                // expression ensures that multiple occurrences are replaced 
                text = text.replace(new RegExp("{" + key +"}", "g"), values[key]); 
            } 
        }
		
		// Return the text with all placeholder values replaced with real ones 
        return text; 
    }, 
	
    // The toCamelCase method takes a hyphenated value and converts it into 
    // a camel case equivalent, e.g.,  margin-left becomes marginLeft. Hyphens 
    // are removed, and each word after the first begins with a capital letter 
	
    toCamelCase: function(hyphenatedValue) { 
        var result = hyphenatedValue.replace(/-\D/g, function(character) { 
            return character.charAt(1).toUpperCase(); 
        }); 
        return result; 
    }, 
	
    // The toHyphens method performs the opposite conversion, taking a camel 
    // case string and converting it into a hyphenated one. 
    // e.g., marginLeft becomes  margin-left 
	
    toHyphens: function(camelCaseValue) { 
        var result = camelCaseValue.replace(/[A-Z]/g, function(character) { 
          return  ('-' + character.charAt(0).toLowerCase()); 
        }); 
        return result; 
    } 
}; 

// Example usage on a page 

// Instantiate the library as a singleton 
$ = new $(); 

// Combine two object literals 
var creature = { 
    face: 1, 
    arms: 2, 
    legs: 2 
}; 

var animal = { 
    legs: 4, 
    chicken: true 
}; 

// Resulting object literal becomes... 
// { 
//     face: 1, 
//     arms: 2,
//     legs: 4, 
//     chicken: true 
// } 
creature = $.Utils.mergeObjects(creature, animal); 

// Outputs "You have 3 messages waiting in your inbox."; 
$.Utils.replaceText("You have {count} messages waiting in your {folder}.", { 
    count: 3, 
    folder: "inbox" 
}); 

// Outputs "fontFamily" 
alert($.Utils.toCamelCase("font-family")); 

// Outputs  "font-family" 
alert($.Utils.toHyphens("fontFamily")); 