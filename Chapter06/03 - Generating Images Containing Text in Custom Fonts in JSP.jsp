<% 
    // Let's kick things off by grabbing the value of the text parameter from the 
    // query string, which we'll use as the text to render within our image. 
    
    String text = request.getParameter("text"); 
    
    // Next, we'll declare a few variables for use later in our code, which we'll 
    // use to store our font file location, the text size we wish to use and the 
    // foreground and background colors for the text and canvas, respectively. 
    
    String fontFileLocation = "font-file-location.ttf"; 
    float size = 24f; 
    Color color = Color.BLACK; 
    Color backgroundColor = Color.WHITE; 
    
    // Now we've defined our variables, let's create an object instance to represent 
    // the font we wish to use, which we'll grab from the server file system, and 
    // then set our desired size. 
    
    Font font = Font.createFont(Font.TRUETYPE_FONT, new java.io.FileInputStream(fontFileLocation)); 
    font = font.deriveFont(size); 
    
    // Before we create our canvas and draw our text onto it, we first establish how 
    // large we need that canvas to be by measuring the dimensions of the text 
    // drawn in our font using a temporary container to perform the measurement 
    // within. 
    
    FontRenderContext fontRenderContext = new FontRenderContext(); 
    TextLayout textLayout = new TextLayout(text, font, fontRenderContext); 
    Rectangle2D dimensions = textLayout.getBounds(); 
    int width = (int)Math.ceil(dimensions.getWidth()); 
    int height = (int)Math.ceil(dimensions.getHeight()); 
    
    // Now we've established the width and height our canvas needs to be, we can 
    // create our empty canvas, specifying a high color depth. 
    
    BufferedImage canvas = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB); 
    
    // The methods we need to draw within this empty canvas are contained within 
    // Java's Graphics2D class. Before we can use these methods, we must 
    // associate an instance of this object with our canvas. 
    
    Graphics2D graphics = canvas.createGraphics();
    
    // Our next step is to fill the canvas with our background color, which is 
    // achieved by setting the color to be used and then creating a solid rectangle 
    // shape to fill the canvas with the set color. 
    
    graphics.setColor(backgroundColor); 
    int topLeftPositionX = 0; 
    int topLeftPositionY = 0; 
    graphics.fillRect(topLeftPositionX, topLeftPositionY, width, height); 
    
    // With our canvas filled with our background color, we can now prepare to 
    // write our text on top. We need to set the color and font of the text, and 
    // also the top and left positions of the font's baseline, the imaginary 
    // horizontal line upon which characters of a font are positioned, as 
    // described in  Figure 6-2, earlier in this chapter. 
    
    graphics.setFont(font); 
    graphics.setColor(color); 
    float baseLinePositionX = (float)-dimensions.getX(); 
    float baseLinePositionY = (float)-dimensions.getY(); 
    
    // With the color, size and position set, we are finally in a position to draw 
    // our text onto the canvas. 
    
    graphics.drawString(text, baseLinePositionX, baseLinePositionY); 
    
    // With our canvas complete, it remains for us to output the canvas to the 
    // browser, first correctly setting the content type of the response and finally 
    // returning the application memory used by the canvas to the server for use 
    // elsewhere. 
    
    response.setContentType("image/png"); 
    ServletOutputStream outputStream = response.getOutputStream(); 
    PNGImageEncoder imageEncoder = PNGCodec.createPNGEncoder(outputStream); 
    imageEncoder.encode(canvas); 
    graphics.dispose(); 
%>   