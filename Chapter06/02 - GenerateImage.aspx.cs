namespace CustomImage 
{ 
    using System; 
    using System.Drawing; 
    using System.Drawing.Text; 
    using System.Web; 
    
    public class GenerateImage: System.Web.UI.Page 
    { 
        protected void Page_Load(object sender, EventArgs e) 
        { 
            // Extract the text we wish to display from the query string 
            // parameter text. 
            string text = Request.QueryString["text"]; 
            
            // Define variables for the other information we need to represent our 
            // font: the font file location, its size, color and background color 
            // of the canvas we wish to display the text on top of. 
            
            string fontFileLocation =  "font-file-location.ttf"; 
            int size = 24; 
            Color color = Color.Black; 
            Color backgroundColor = Color.White;
            
            // Next, we create a new Bitmap object, which represents the empty 
            // canvas within which we will place our text. We start with a  catch-22 
            // situation, however, as we want to create a canvas as large as the 
            // text we wish to represent, but unfortunately we can't measure the 
            // dimensions of the text without having a canvas to put the text on. 
            // The way we overcome this hurdle is by starting off with a dummy 
            // canvas, measuring 1 pixel by 1 pixel in size, which we will use as 
            // the basis for our text measurements and then replace with the 
            // real canvas later. 
            
            Bitmap canvas = new Bitmap(1, 1); 
            
            // Within ASP.NET, the Graphics class contains the methods we need to 
            // draw and measure text that sits on the canvas. The first step before 
            // using these methods is to declare an instance of the object and 
            // associate it with our canvas. 
            
            Graphics graphics = Graphics.FromImage(canvas); 
            
            // Before writing any text, we need to define our font. ASP.NET defines 
            // two types of font collections: the fonts installed on the system and 
            // a private collection of fonts that can be loaded dynamically
            // from a file for temporary use. It is the latter we need to use, so we 
            // create a new private font collection and add our font to it using the 
            // file location of the TrueType font we declared earlier. 
            
            PrivateFontCollection myFonts = new PrivateFontCollection(); 
            myFonts.AddFontFile(Server.MapPath(fontFileLocation)); 
            
            // Individual fonts are always associated with font families, which are 
            // a collection of related fonts that belong together. These families 
            // consist of variations of the same font, such as bold or italicized 
            // versions of the same font. Now we have added our font to our private 
            // font collection, it is stored within its family group, which has been 
            // defined within the font file and extracted automatically by ASP.NET. 
            // To get a font reference we can use in our code, we must get to it 
            // through its font family. We know that we have only added one font, 
            // which can only belong to one font family, so we can get this font 
            // family in code. 
            
            FontFamily myFontFamily = myFonts.Families(0); 
            
            // Now we can create a reference to the specific font within this family 
            // in the required size, which we choose to measure in pixels. 
            
            Font myFont = new Font(myFontFamily, size, FontStyle.Regular, GraphicsUnit.Pixel); 
            
            // Now we have our text and a definition of our font, we need to measure 
            // the space that text will consume when written out to our canvas. We 
            // use the MeasureString method to achieve this, passing it the text to 
            // render and the font definition, and it gives back the width and 
            // height dimensions of the rendered text. 
            
            int width = Convert.ToInt32(graphics.MeasureString(text, myFont).Width); 
            int height = Convert.ToInt32(graphics.MeasureString(text, myFont).Height); 
            
            // With the width and height of the rendered text established, we now 
            // need to re-create our canvas using these dimensions and specifying 
            // a color depth for the final image (24-bit RGB in this case). 
            
            canvas = new Bitmap(width, height, PixelFormat.Format24bppRgb); 
            graphics = Graphics.FromImage(canvas); 
            
            // We have our final canvas created, so we can start to build up what 
            // will be the final image. Let's start this by filling the canvas with 
            // our background color, which we defined earlier as white.
            
            graphics.Clear(backgroundColor);
            
            // Now, before we can write our text onto the canvas, we need to 
            // generate an instance of the ASP.NET concept of a brush to paint 
            // the text with. We don't want anything too fancy for now, so we'll 
            // instantiate a solid color brush, using the foreground text color we 
            // assigned earlier. 
            
            SolidBrush brush = new SolidBrush(color); 
            
            // OK, now everything is set up ready for us to paint our text onto the 
            // canvas with our selected font. The following code draws the text 
            // onto the canvas using our brush, starting at the top left corner of 
            // the canvas area. 
            
            int topLeftCornerX = 0; 
            int topLeftCornerY = 0; 
            graphics.DrawString(text, myFont, brush, topLeftCornerX, topLeftCornerY, StringFormat.GenericTypographic); 
                
            // We have our canvas all ready to display, so the next step is to 
            // actually draw it out to the screen as a PNG-format image. Before 
            // that, we first send the correct content type header to the browser 
            // so it will display the data as an image, and finally we free up the 
            // application memory taken up by the canvas for use by the rest 
            // of the web server. 
            
            Response.ContentType = "image/png"; 
            canvas.Save(Response.OutputStream, ImageFormat.Png); 
            canvas.Dispose(); 
        } 
    } 
} 