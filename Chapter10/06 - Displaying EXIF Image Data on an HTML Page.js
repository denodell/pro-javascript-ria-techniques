$.onDomReady(function() { 

    // Wait for the DOM to become ready, then load the image file, extract its 
    // information and display it on the page 
    $.Remote.loadBinary({ 
	
        // Load the binary file referred to within the <img> tag on the HTML page 
        url: document.getElementById("image").src, 
		
        // Only load the first 2KB of data (2048 bytes = 2KB) from the file since 
        // the header information is stored at the beginning of the file. Loading 
        // too much data can cause the whole data extraction routine to 
        // run a lot slower - especially in IE 
        length: 2048, 
		
        // Specify a callback function to execute once the first 2KB of the image 
        // file have loaded, passing it an instance of the BinaryReader object 
        callback: function(data){ 
		
            // Read the EXIF data from the binary file 
            var exifData = new ExifReader(data); 
			
            // Store the main image information in a local variable 
            var mainImageData = exifData.MainImage; 
			
            // Store the extended image information in a local variable 
            var extendedData = exifData.ExtendedData; 
			
            // Store the GPS location information in a local variable 
            var gpsData = exifData.GPSData;
			
			// Define a renderTable function, which will append a heading as a 
            // <h2> tag and a set of name/value pairs as rows within a <table> 
            // tag to a supplied DOM element 
            var renderTable = function(dom, headingText, fields){ 
			
                // Create a new <h2> tag, set its text to the supplied headingText 
                // and add the element to the DOM object passed in 
                var heading = $.Elements.create("h2"); 
                heading.innerHTML = headingText; 
                dom.appendChild(heading); 
				
                // Create new <table> and <tbody> tags. Internet Explorer will not 
                // add <tr> table rows directly to a <table> tag. It will only do 
                // this to a <tbody> tag 
                var table = $.Elements.create("table"); 
                var tbody = $.Elements.create("tbody"); 
				
                // Loop through the name/value pairs passed in as an object literal 
                for (var field in fields) { 
                    if (fields[field]) { 
					
                        // Create a new table header <th> tag and set its text to 
                        // the name portion of this name/value pair 
                        var th = $.Elements.create("th"); 
                        th.innerHTML = field; 
						
                        // Create a new table cell <td> tag and set its text to the 
                        // value of the name/value pair 
                        var td = $.Elements.create("td"); 
                        td.innerHTML = fields[field]; 
						
                        // Create a new table row <tr> tag and add the table header 
                        // and cell tags, finally appending the row itself to the 
                        // <tbody> tag created earlier 
                        var tr = $.Elements.create("tr"); 
                        tr.appendChild(th); 
                        tr.appendChild(td); 
                        tbody.appendChild(tr); 
                    } 
                } 
				
                // Append the <tbody> tag to the <table> tag and append that to the 
                // DOM object passed in and return the resulting DOM object 
                table.appendChild(tbody); 
                dom.appendChild(table); 
                return dom; 
            }
			
			// Create a new DocumentFragment, as explained in Chapter 4, for 
            // faster DOM manipulations 
            var miniDOM = document.createDocumentFragment(); 
			
            if (mainImageData) { 
                // If the main image information data exists, then render a "Main 
                // Image Data" heading and associated <table> tag containing the 
                // specified name/value data pairs stored in an object literal 
                miniDOM = renderTable(miniDOM, "Main Image Data", { 
                    "Taken At": mainImageData.DateTime, 
                    "Host Computer": mainImageData.HostComputer, 
                    "Make": mainImageData.Make, 
                    "Model": mainImageData.Model, 
                    "Software": mainImageData.Software, 
                    "Resolution": mainImageData.XResolution + " x " + mainImageData.YResolution + " " + mainImageData.ResolutionUnit, 
                    "Camera Orientation": mainImageData.Orientation 
                }); 
            } 
			
            if (extendedData) { 
                // If the extended image information data is present, then render 
                // this data onto the page 
                miniDOM = renderTable(miniDOM, "Extended Image Data", { 
                    "ColorSpace": extendedData.ColorSpace, 
                    "F Stop": extendedData.FNumber, 
                    "Width": extendedData.ImageWidth, 
                    "Height": extendedData.ImageHeight 
                }); 
            } 
			
            if (gpsData) { 
                // If the GPS location information data is present in the EXIF data 
                // of the image file, then display this on the page 
                miniDOM = renderTable(miniDOM, "GPS Data", { 
                    "Latitude": gpsData.Latitude.standard + " " + gpsData.LatitudeRef, 
                    "Longitude": gpsData.Longitude.standard + " " +gpsData.LongitudeRef 
                }); 
				
                // In addition, create a link to Google Maps, passing the latitude 
                // and longitude in the query string of the URL in decimal format 
                var link = $.Elements.create("a"); 
                var href = []; 
                href.push("http://maps.google.com/maps?z=12&q=");
				
				// In the decimal format, negative numbers relate to points below 
                // the equator, in the southern hemisphere 
                href.push(gpsData.LatitudeRef == "S" ? "-" : ""); 
                href.push(gpsData.Latitude.decimal); 
                href.push(","); 
				
                // In the decimal format, negative numbers relate to points to the 
                // west of Greenwich, London 
                href.push(gpsData.LongitudeRef == "W" ? "-" : ""); 
                href.push(gpsData.Longitude.decimal); 
                link.href = href.join(""); 
                link.innerHTML = "Show location on a Google map"; 
				
                // Add this new link to the DocumentFragment object 
                miniDOM.appendChild(link); 
            } 
			
            // Take the contents of the DocumentFragment and add it to the <div 
            // id="output"> element on the HTML page. We only interact with the live 
            // DOM once in this code, here. This provides a good performance 
            // improvement over interacting with the live DOM for each element added 
            document.getElementById("output").appendChild(miniDOM.cloneNode(true)); 
        } 
    }); 
}); 