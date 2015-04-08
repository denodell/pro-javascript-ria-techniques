// Add a DBStorage namespace to contain all  client-side database storage-related 
// methods 
$.prototype.Storage.DBStorage = { 

    // There can be multiple databases in each domain, but for this example we'll 
    // define a single one to use throughout the application 
    databaseName: "data_store", 
    databaseDesc: "Data store", 
	
    // Specify which SQLite database version we are using, in case future versions 
    // alter methods 
    sqlLiteDBVersion: "1.0", 
	
    // 5MB of storage = 5120 bytes. This is the maximum default size of the 
    // SQLite database 
    FIVE_MB: 5120, 
	
    // Define a database table name for storing our data 
    tableName:  "data-store", 
	
    // Define a property to store a reference to the database 
    database: null, 
    
    // The initialize method creates the table in the database to store our name and 
    // value data in, if it does not already exist. The name becomes the primary key 
    initialize: function() { 
	
        // Open the SQLite database 
        this.database = openDatabase(this.databaseName, this.sqlLiteDBVersion, this.databaseDesc, this.FIVE_MB);
		
		// Construct the SQL command to create a table in the database 
        var command = "CREATE TABLE IF NOT EXISTS {tableName} (name TEXT UNIQUE NOT NULL PRIMARY KEY, value TEXT NOT NULL)"; 
        command = $.Utils.replaceText(command, { 
            tableName: this.tableName 
        }); 
		
        // Execute the SQL command 
        this.execute(command); 
    }, 
 
    // The execute method executes a given SQL command against the database, 
    // executing an optional callback function on the command's completion, 
    // passing across the result of the transaction against the database to that 
    // callback function 
    execute: function(command, callback) { 
        callback = callback || function() {}; 
		
        // Execute the supplied SQL command, then execute the callback function 
        this.database.transaction(function(db) { 
            db.executeSql(command, [], callback); 
        }); 
    }, 
	
    // The get method performs a lookup against the database for the name key and 
    // passes the value it finds, if any, into the supplied callback function 
    get: function(name, callback) { 
	
        // Generate the command to locate a value from the database by name 
        var command = "SELECT value FROM {tableName} WHERE name = {name}"; 
        command = $.Utils.replaceText(command, { 
            tableName: this.tableName, 
            name: name 
        }); 
		
        // Execute the SQL command 
        this.execute(command, function(db, result) { 
            var value = ""; 
			
            // Locate the value within the first row of the SQL data returned 
            if (result.rows.length > 0) { 
                value = result.rows.item(0)['value']; 
            } 
			
            // Execute the callback method, passing it the value found, if any 
            callback(value);
			
			// Return a null value in case any calling method is expecting a 
            // return value from this method - no code should expect this, but 
            // just in case, we provide a return value here 
            return null; 
        }); 
    }, 
	
    // The set method stores a value by name into the database 
    set: function(input) { 
	
        // Expect an object literal as an input, containing name and value to set 
        var name = input.name || ""; 
        var value = input.value || ""; 
		
        var self = this; 
		
        // Check to see if a value already exists by this name in the database 
        this.get(name, function(value) { 
		
            // By default, we will insert the value into the database, so specify 
            // the command to do that 
            var command = "INSERT INTO {tableName} (name, value) VALUES ({name} , {value})"; 
			
            // If a value already exists against this name in the database, perform 
            // a SQL update command instead 
            if (value != "") { 
                command = "UPDATE {tableName} SET value = {value} WHERE  name = {name}";
            } 
			
            command = $.Utils.replaceText(command, { 
                tableName: self.tableName, 
                name: name, 
                value: value 
            }); 
			
            // Execute the SQL command, saving the data into the database 
            this.execute(command); 
        }); 
    }, 
	
    // The remove method deletes the name and value from the database 
    remove: function(name) {

		// Generate the SQL command to remove the value from the database 
        var command = "DELETE FROM {tableName} WHERE name = {name}"; 
        command = $.Utils.replaceText(command, { 
            tableName: this.tableName, 
            name: name 
        }); 
		
        // Execute the command, removing the entry from the database 
        this.execute(command); 
    } 
}