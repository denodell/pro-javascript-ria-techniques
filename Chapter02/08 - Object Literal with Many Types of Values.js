var earth = { 
    name: "Terra Firma", // String 
    planet: true, // Boolean 
    moons: 1, // Integer (whole) number 
    diameter: 12756.36, // Floating point number (decimal) 
    oceans: ["Atlantic", "Pacific", "Indian", "Arctic", "Antarctic"], // Array 
    poles: { // A nested object literal 
        north: "Arctic", 
        south: "Antarctic" 
    }, 
    setDiameter: function(diameter) { // Function 
        this.diameter = diameter; // The this keyword refers to the earth variable 
    } 
} 

// Dot notation is used to access properties of the object 
alert(earth.diameter); // Outputs "12756.36" 
earth.setDiameter(12756.37); 
alert(earth.diameter); // Outputs "12756.37" 