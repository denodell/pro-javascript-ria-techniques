<?php
// First, we need to know the actual text we wish to represent. Assuming the text 
// is being passed to this script via a query string parameter named text in the 
// URL, we can extract the text to display from the URL into a variable with the 
// following line of code. 

$text = $_GET['text'];

// Now we that have our text, we need to know how big to create our empty canvas to 
// completely encompass the rendered text in our chosen font. To establish the size 
// of the bounding box surrounding our text, we can call a handy function, 
// ImageTTFBBox, passing it the font size, display angle, font file location and the 
// actual text we wish to represent. 

$fontFilename =  'font-file-location.ttf'; 
$size = 24; 
$angle = 0; 
$boundingBox = @ImageTTFBBox($size, $angle, $fontFilename, $text); 

// The variable $boundingBox is an array of points around the bounding box from 
// which we can establish the width and height we require our canvas to be. 

$lowerLeftCornerX = $boundingBox[0]; 
$lowerLeftCornerY = $boundingBox[1]; 
$lowerRightCornerX = $boundingBox[2]; 
$lowerRightCornerY = $boundingBox[3]; 
$upperRightCornerY = $boundingBox[5]; 
$width = abs($lowerRightCornerX - $lowerLeftCornerX); 
$height = abs($upperRightCornerY - $lowerRightCornerY); 

// Creating an empty canvas of our required dimensions is then as simple as 
// calling the PHP method ImageCreate. 

$image = @ImageCreate($width, $height); 

// The first thing to do with our blank canvas is to set its background color. When 
// we set colors, we need to separate the red, green and blue components and 
// represent them in hexadecimal. In this case, we wish to use a white background. 
// Within CSS, we would specify this as #ffffff; in PHP we would specify it in the 
// following format. 

$background_hex['red'] = 0xFF; 
$background_hex['green'] = 0xFF; 
$background_hex['blue'] = 0xFF; 

// To set the background color of our canvas, we use the ImageColorAllocate 
// method. This method must be called for every color to be 
// used within our canvas, though its first use against an image canvas always sets 
// the background color, which is what it is used for here.
 
$background  = @ImageColorAllocate($image, $background_hex['red'], $background_hex['green'], $background_hex['blue']); 

// Now we have our empty canvas with a colored background. We move onto the 
// contents of our canvas: the text. We already have the location of the font file 
// to use and the size of the text. Before we write into the canvas, we need to 
// also specify its color. We must specify colors in their constituent hexadecimal, 
// parts as with our background color, previously, and make a call to 
// ImageColorAllocate to create the color reference required by other PHP 
// methods later. 

$color_hex['red'] = 0x00; 
$color_hex['green'] = 0x00; 
$color_hex['blue'] = 0x00; 
$color = ImageColorAllocate($image, $color_hex['red'], $color_hex['green'], $color_hex['blue']); 

// Before we render our text into the canvas, we need to calculate the baseline 
// position of our font, which will be the point at which the text is rendered from, 
// as we saw in  Figure 6-2, earlier in the chapter. 

$top = -$lowerLeftCornerX; 
$left = abs($upperRightCornerY - $lowerRightCornerY) - $lowerLeftCornerY; 

// Render the text onto the canvas. 

ImageTTFText($image, $size, $angle, $left, $top, $color, $fontFilename, $text); 

// And finally we draw the canvas to the screen as a PNG image file using the 
// ImagePNG function, first setting the correct response header to the browser, 
// and finally destroying the reference to the created canvas to conserve PHP 
// application memory. 

header('Content-type: image/png') ; 
ImagePNG($image) ; 
ImageDestroy($image); 
?>