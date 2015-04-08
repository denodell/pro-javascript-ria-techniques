// The ExifData constructor takes a BinaryReader object as its only input and 
// returns an object containing the image information stored within its 
// binary data 

var ExifReader = function(data) { 

    // Create an object literal containing a selection of tag IDs stored within the 
    // IFD representing the main image data 
    var MainImageTags = { 
        // Company name. e.g., Nikon, Motorola, Apple, etc. 
        "010F": "Make", 
		
        // Camera name. e.g., D80, iPhone, etc. 
        "0110": "Model", 
		
		// Angle of the camera when the image was taken, to the nearest 90° 
        "0112": "Orientation", 
		
        // Resolution of the x axis of the image. e.g., 72 
        "011A": "XResolution", 
		
        // Resolution of the y axis of the image. e.g., 72 
        "011B": "YResolution", 
		
        // A value representing the unit the resolution data is stored in 
        "0128": "ResolutionUnit", 
		
        // The name of the software package used to manipulate the image after it 
        // was taken. e.g., Adobe Photoshop. 
        "0131": "Software", 
		
        // The date and time the image was taken 
        "0132": "DateTime", 
		
        // The computer operating system used to manipulate the image after it was 
        // taken. e.g., Mac OS X 
        "013C": "HostComputer", 
		
        // A value representing the location of further image data 
        "8769": "ExifOffset", 
		
        // A value representing the location of longitude and latitude data denoting 
        // where on the globe the image was taken 
        "8825": "GPSOffset" 
		
        // Many more tags exist, but have been removed for brevity 
    } 
	
    // Create an object literal containing a selection of tag IDs representing 
    // further image information data 
    var ExtendedDataTags = { 
        // The  F-Stop position of the camera at the point the photo was taken. 
        // e.g., F2.8 
        "829D": "FNumber", 
		
        // A value representing the color profile of the image data 
        "A001": "ColorSpace", 
		
        // The width of the image. e.g., 800 
        "A002": "ImageWidth",
		
		// The height of the image. e.g., 600 
        "A003": "ImageHeight" 
		
        // Many more tags exist, but have been removed for brevity 
    } 
	
    // Create an object literal containing a selection of tag IDs representing the 
    // latitude and longitude position the image was taken 
    var GPSTags = { 
        // The location in relation to the equator. 
        // e.g., "N" for North, "S" for South 
        "0001" : "LatitudeRef", 
		
        // The latitude represented in degrees, minutes and seconds 
        "0002" : "Latitude", 
		
        // The location in relation to the Prime Meridian line, passing through 
        // Greenwich, London. e.g., "E" for East, "W" for West 
        "0003" : "LongitudeRef",
		 
        // The longitude represented in degrees, minutes and seconds 
        "0004" : "Longitude" 
		
        // Many more tags exist, but have been removed for brevity 
    } 
	
    // Create an object literal to provide user-friendly text in place of those 
    // values that are reference values. The key of each object is the tag name 
    // from the lists defined above 
    var LookupValues = { 
	
        // The Orientation tag data denotes a single digit from 1 to 8 
        "Orientation": { 
            1: "Straight On", 
            2: "Straight On - Image Flipped", 
            3: "180°", 
            4: "180° - Image Flipped", 
            5: "90°  Counter-clockwise - Image Flipped", 
            6: "90° Clockwise", 
            7: "90° Clockwise - Image Flipped", 
            8: "90°  Counter-clockwise" 
        },
		
		// The ResolutionUnit tag data denotes a single digit from 1 to 3 
        "ResolutionUnit": { 
            1: "No unit", 
            2: "Pixels Per Inch", 
            3: "Pixels Per Centimeter" 
        }, 
		
        // The ColorSpace tag data is either the value 1 or the value 65535 
        "ColorSpace": { 
            1: "sRGB", 
            65535: "Uncalibrated" 
        } 
    } 
	
    // The exifPosition property stores the location within the data of the start of 
    // the EXIF data. Note how we use an anonymous function to execute a routine 
    // to locate this position 
    this.exifPosition = function() { 
        var pointer = 0; 
        var length = data.getLength(); 
		
        // Loop through the binary file data, looking for the FFE1 hex value that 
        // denotes the start of the EXIF data section 
        while (pointer <= length) { 
            if (data.getHex(pointer, 2) == "FFE1") { 
                return pointer; 
            } 
            pointer++; 
        } 
    }(); 
	
    // The isExif property denotes whether there is EXIF data stored at 
    // the location denoted by the exifPosition property 
    this.isExif = function(position) { 
	
        // position denotes the start of the EXIF data section. The first 4 bytes 
        // of data in this section are FFE1ssss, where ssss denotes the total size 
        // of the EXIF data section. The next 4 bytes should be the string "Exif", 
        // followed by 2 bytes representing the number 0. If this is the case, we 
        // have confirmed that this is indeed EXIF data 
        var exifString = data.getString(position + 4, 4); 
        var dataValue = data.getNumber(position + 8, 2); 
        return (exifString == "Exif") && (dataValue == 0);
    }(this.exifPosition);
	
	if (this.isExif) { 
	
        // If we have confirmed that the data we are reading is in EXIF format, 
        // then continue with the routine. 
		
        // The dataStartPosition property denotes the point at which the rest of 
        // the EXIF data is measured from. Any data offset values are measured 
        // from this point. The point is situated after the "Exif" string and the 2 
        // bytes of the number 0, located previously 
        this.dataStartPosition = this.exifPosition + 10; 
		
        // The first 2 bytes of data in this section denote the alignment of the 
        // rest of the data. This data is a string with two possible values: 
        // MM denotes the standard big endian data format is used, whereas 
        // II denotes the reversed little endian format is being used. We use 
        // this value to set the isBigEndian property of the BinaryReader object 
        // instance referred to by the data object 
        var byteAlign = data.getString(this.dataStartPosition, 2); 
        data.setIsBigEndian((byteAlign == "MM")); 
		
        // The next 2 bytes of data denote that IFD tag data is coming up 
        var tagMark = data.getHex(this.dataStartPosition + 2, 2); 
		
        // The next 4 bytes of data represent a number pointing to the offset 
        // position of the start of the first IFD within this EXIF data 
        var offsetToFirstIFD = data.getNumber(this.dataStartPosition + 4, 4); 
		
        // Create a function we can reuse to locate tags within a particular IFD 
        // and work out their values. The readIFD function takes four parameters: 
        // - data: The BinaryReader object instance to read binary data from 
        // - start: The start position of EXIF data 
        //     (we'll pass in dataStartPosition) 
        // - offset: The distance in bytes from the start position of EXIF data to 
        //     the start of the IFD to be read 
        // - tagSet: An object literal  cross-referencing tag IDs to readable 
        //     tag names 
        var readIFD = function(data, start, offset, tagSet) { 
		
            // The first 2 bytes of any IFD denote the number of tags in that IFD. 
            // Each tag is 12 bytes long 
            var numberOfTags = data.getNumber(start + offset, 2); 
			
            // The last 4 bytes of any IFD denote an offset to the next 
            // connected IFD 
            var nextOffset = data.getNumber(start + offset + 2 +  (numberOfTags * 12), 4);
			
			// Create an object literal for storing the tag names and 
            // values to return 
            var tags = {}; 
			
            // Add the location of the next IFD data to the output object literal 
            tags.NextOffset = nextOffset; 
			
            // Go through each tag in the directory one by one 
            for (var index = 0; index < numberOfTags; index++) { 
			
                // Calculate where the tag begins. We need to account for the first 
                // 2 bytes in the IFD, which denote the number of tags 
                var tagStartPosition = start + offset + 2 + (index * 12); 
				
                // The first 2 bytes of this tag denote an ID representing what the 
                // data stored within this tag actually means 
                var id = data.getHex(tagStartPosition, 2); 
				
                // Look up the name relating to the tag ID from the tagSet 
                // object literal 
                var tagName = tagSet[id]; 
				
                if (tagName) { 
				
                    // The next 2 bytes after the tag ID denote the data format of 
                    // the information stored within this tag 
                    var format = data.getNumber(tagStartPosition + 2, 2); 
					
                    // The next 4 bytes denote the length of the tag data 
                    var tagDataLength = data.getNumber(tagStartPosition + 4, 4); 
					
                    // The final 4 bytes of the 12-byte tag contain either the 
                    // tag data itself if the length of the data is 4 bytes or less, 
                    // or an offset distance in bytes to the location where 
                    // the tag data is stored within the file 
                    var value = data.getNumber(tagStartPosition + 8, 4); 
					
                    // Create a temporary variable to store the tag data in 
                    var tagData = ""; 
					
                    // Calculate the tag data value based on the format of that data 
                    switch (format) { 
					
                        // A format value of 2 denotes the tag data is stored 
                        // as a string
						case 2: 
                            // Locate the position in the binary data file where the 
                            // tag data is to be found. If the tag data is longer 
                            // than 4 bytes, it will be found at the distance stored 
                            // in the value variable from the start of the EXIF 
                            // data. If the tag data is 4 bytes or shorter, the data 
                            // is located within the last 4 bytes of the tag itself 
                            var dataPosition = (tagDataLength > 4) ? start + value : tagStartPosition + 8; 
							
                            // Locate the string representing the tag data. 
                            // According to the EXIF format, the last byte of string 
                            // data is always "00", so we can ignore this last byte 
                            tagData = data.getString(dataPosition, tagDataLength - 1); 
							
                            break; 
							
                        // A format value of 3 denotes the tag data is stored as a 
                        // number, 2 bytes in length 
                        case 3: 
						
                            // Find the  2-byte number stored 8 bytes in from 
                            // the start of the tag 
                            tagData = data.getNumber(tagStartPosition + 8, 2); 
                            break; 
							
                        // A format value of 4 denotes the tag data is a
						// 4-byte number 
                        case 4: 
						
                            // In this case, we simply return the number stored in 
                            // the value variable that we extracted earlier 
                            tagData = value; 
                            break; 
							
                        // A format value of 5 denotes the tag data is stored as a 
                        // rational number, the result of one number divided by 
                        // another. The first 4-byte number in an  8- byte sequence 
                        // is the numerator, the second 4-byte number is 
                        // the denominator 
                        case 5: 
						
                            // Define an array to store the tag data 
                            var tagDataArray = [];
							
							// Calculate rational numbers for as long as there is 
                            // data to process 
                            for (var rIndex = 0; rIndex < tagDataLength; rIndex++) { 
							
                                // Locate the start position of the  8-byte sequence 
                                // representing this rational number 
                                var rationalStartPosition = value + start + (8 * rIndex); 
								
                                // The numerator is the first 4-byte number of the 
                                //  8-byte data sequence 
                                var numerator = data.getNumber(rationalStartPosition, 4); 
								
                                // The denominator is the second  4-byte number of 
                                // the  8-byte data sequence 
                                var denominator = data.getNumber(rationalStartPosition + 4, 4); 
									
                                // Add the resulting rational number to 
                                // the tagDataArray 
                                tagDataArray.push(numerator / denominator); 
                            } 
							
                            // Return the array of rational numbers 
                            tagData = tagDataArray; 
                            break; 
							
                        // A format value of 7 denotes the tag data is of an 
                        // undefined or  case-specific custom type 
                        case 7: 
						
                            // Locate the position in the binary data file where the 
                            // tag data is to be found 
                            var dataPosition = tagDataLength > 4 ? start + value : tagStartPosition + 8; 
							
                            // Return the string representation of the data 
                            // stored in this tag 
                            tagData = data.getString(dataPosition, tagDataLength); 
                            break;
							
                        default: 
                            break; 
                    }
					
					// Certain tag data values, such as Orientation and 
                    // ResolutionUnit, are stored as numbers representing 
                    // equivalent text values. These text values are stored 
                    // in the LookupValues object literal. If the current tag 
                    // name is found in that object literal, then replace the 
                    // tagData with the  user-friendly text representation 
                    // of the current data value 
                    if (LookupValues[tagName]) { 
                        tagData = LookupValues[tagName][tagData]; 
                    } 
					
                    // Certain tag data, such as DateTime and GPS Latitude and 
                    // Longitude, are not stored in user- or code-friendly formats. 
                    // The reformat method, defined later, reformats the tag data 
                    // that requires it into a better format 
                    tags[tagName] = reformat(tagName, tagData); 
                } 
            } 
			
            // Return the tags object literal, containing the tag names and 
            // their associated data in a user-friendly format 
            return tags; 
        } 
		
        // The reformat method converts certain IFD tag data into a format that is 
        // more code- or user-friendly 
        var reformat = function(tagName, tagData){ 
            switch (tagName) { 
                case "DateTime": 
				
                    // Tag data in the DateTime tag is stored as a string in the 
                    // format YYYY:MM:DD HH:MM:SS. Let's convert that string 
                    // to a native JavaScript Date object 
                    var datePart = value.split(" ")[0].split(":"); 
                    var timePart = value.split(" ")[1].split(":"); 
                    var year = datePart[0]; 
					
                    // Months in JavaScript run from 0 - 11 
                    var month = datePart[1] - 1; 
                    var day = datePart[2]; 
                    var hour = timePart[0]; 
                    var minute = timePart[1]; 
                    var second = timePart[2];
					
					// Replace the tagData with a JavaScript Date object 
                    // old representing the string-based date 
                    tagData = new Date(year, month, day, hour, minute, second); 
                    break; 
					
                case "Latitude": 
                case "Longitude": 
				
                    // Latitude and longitude data is stored as an array of three: 
                    // values: degrees, minutes and seconds, which together refer 
                    // to a point on the globe. Let's take this format and convert 
                    // it into two others, the standard format for representing 
                    // geo-location data: degrees° minutes' seconds" 
                    // and a decimal-based format favored by Google Maps and others 
                    var degrees = parseFloat(value[0]); 
                    var minutes = parseFloat(value[1]); 
                    var seconds = parseFloat(value[2]); 
					
                    // The decimal format found by turning the minutes and seconds 
                    // from base 60 values to base 100 values and adding them to 
                    // the degrees 
                    var decimalFormat = (degrees + (minutes / 60) +  ((seconds / 60)/100)); 
					
                    // Some GPS latitude and longitude tags do not represent seconds 
                    // separately, but rather store their minutes value as a 
                    // floating point number. If this is the case, we should 
                    // separate out the minutes and seconds values in order to 
                    // represent them correctly in the standard format 
                    if (Math.floor(minutes) < minutes) { 
                        seconds += (minutes - Math.floor(minutes)) * 60; 
                        minutes = Math.floor(minutes); 
                        seconds = Math.round(seconds * 100) / 100; 
                    } 
                    var standardFormat = degrees + "° " + minutes + "' " + seconds + "\""; 
					
                    // Replace the tagData with an object literal containing both 
                    // standard and decimal formats representing the position on 
                    // the globe denoted by the original array representation 
                    tagData = { 
                        standard: standardFormat, 
                        decimal: decimalFormat 
                    } 
                    break;
					
				default: 
                    break; 
            } 
			
            // Return the new tagData where appropriate, or simply return the 
            // original tagData if no reformatting took place 
            return tagData; 
        } 
		
        // Create a MainImage property, containing an object literal of tag names 
        // and associated tag data derived from the main image information data 
        // section of the binary image data 
        this.MainImage = readIFD(data, this.dataStartPosition, offsetToFirstIFD, MainImageTags); 
			
        if (this.MainImage.ExifOffset) { 
		
            // If the MainImage data contains an offset pointing to the location of 
            // an extended image data IFD, then read this data in addition, and 
            // assign the resulting tag data to the ExtendedData property 
            this.ExtendedData = readIFD(data, this.dataStartPosition,  this.MainImage.ExifOffset, ExtendedDataTags); 
        } 
		
        if (this.MainImage.GPSOffset) { 
		
            // If the MainImage data contains an offset pointing to the location of 
            // GPS latitude and longitude data, then read this associated IFD and 
            // assign the resulting tag data to the GPSData property 
            this.GPSData = readIFD(data, this.dataStartPosition,  this.MainImage.GPSOffset, GPSTags); 
        } 
    } 
};