// Internet Explorer does not allow us to return some of the information we 
// require from our binary data. To overcome this, we must write two VBScript 
// (Microsoft's own scripting format) functions to the page, IEgetByte and 
// IEgetLength, which we will call from our JavaScript code when needed. 
// The functions are added to the page using document.writeln and are wrapped 
// in an Internet Explorer conditional comment so they are not read by other 
// browsers.

document.writeln( 
     '<!-- [if IE]>' + 
    '<script type="text/vbscript">\r\n' + 
    '    Function IEgetByte(data, position)\r\n' + 
    '        IEgetByte = AscB(MidB(data,position + 1, 1))\r\n' + 
    '    End Function\r\n' + 
    '    Function IEgetLength(data)\r\n' + 
    '        IEgetLength = LenB(data)\r\n' + 
    '    End Function\r\n' + 
    '</script>' + 
     '<![endif]-- >' 
); 

// The BinaryReader constructor takes raw binary data as its input and contains 
// methods to help extract data in different formats from that raw data 
$.prototype.Remote.BinaryReader = function(data) { 
    // Store the data input to a property of this constructor 
    this.data = data; 
	
    // The isBigEndian property denotes whether or not the binary data being 
    // processed is in the standard hexadecimal format, also known as "big 
    // endian" - where the number 8 would be represented within 4 bytes of data 
    // as 00000008 - or in the reverse format (also known as "little endian") - 
    // where the number 8 would be represented as 08000000. true indicates 
    // the data is big endian, the common format. 
    this.isBigEndian = true; 
	
    // Add a setter method to enable the isBigEndian property value to be 
    // changed as and when needed 
    this.setIsBigEndian = function(isBigEndian) { 
        this.isBigEndian = isBigEndian; 
    } 
	
    // The getLength method returns the length in bytes of the binary data 
    this.getLength = function() { 
	
        // Binary data is represented as a string in all browsers except Internet 
        // Explorer. Standard browsers will simply return the length property of 
        // the string, IE will use the VBScript function declared earlier to 
        // calculate the length of the binary data 
        return (typeof this.data == "string") ? this.data.length : IEgetLength(data); 
    };
	
	// The getByte method returns a single byte of data located at the specified 
    // position in bytes from the start of the data 
    this.getByte = function(position) { 
	
        // Standard browsers will use the charCodeAt function to return a Unicode 
        // value representing the data stored at the specified position, which is 
        // then converted to a hexadecimal value. This does not work in Internet 
        // Explorer, which must use its own VBScript function to extract the 
        // required byte from the data 
        return (typeof this.data == "string") ? (this.data.charCodeAt(position) & 0xFF) : IEgetByte(data, position); 
    }; 
	
    // The getChar method returns the ASCII character represented by the byte 
    // of data stored at the specified position 
    this.getChar = function(position) { 
        return String.fromCharCode(this.getByte(position)); 
    }; 
	
    // The getString method returns the ASCII string represented by the data that 
    // begins at the specified position and continues for the specified length 
    this.getString = function(position, length) { 
	
        // Create an array to store each of the characters of the string 
        var chars = []; 
		
        // Get the character stored at each byte from the specified position until 
        // the specified length, and add it to the array of characters 
        for (var index = position, end = position + length; index < end; index++) { 
            chars.push(this.getChar(index)); 
        } 
		
        // Return the array of characters joined together as a single string 
        return chars.join(""); 
    }; 
	
    // The getHex method returns a string representing the hexadecimal data 
    // beginning at the specified position and continuing for the specified length 
    this.getHex = function(position, length) { 
	
        // Create an array to store each of the individual hexadecimal strings 
        var result = [];
		
		// Get the value of each byte and convert it to base 16 (hexadecimal), 
        // then convert it to a 2 character string and add it to the output array 
        for (var index = position, end = position + length; index < end; index++) { 
            var newByte = this.getByte(index).toString(16).toUpperCase(); 
            result.push((newByte.length == 1) ? "0" + newByte : newByte); 
        } 
		
        // If the data is not stored in the standard big endian format, then reverse 
        // the sequence of the array, which will provide us with little endian 
        // format data 
        if (!this.isBigEndian) { 
            result.reverse(); 
        } 
		
        // Return the array of hexadecimal characters joined together into 
        // a single string 
        return result.join(""); 
    }; 
	
    // The getNumber method executes the getHex method and converts its 
    // result from a base 16 value to a standard integer number 
    this.getNumber = function(position, length) { 
        return parseInt(this.getHex(position, length), 16); 
    }; 
} 