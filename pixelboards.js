// TODO : Change global variables

// Set up a collection to contain board information. On the server,
// it is backed by a MongoDB collection named "pixelboards".
PixelBoardsCollection = new Meteor.Collection("pixelboards");

// Board Class
function PixelBoards ()
{
  this.canvasGrid = null;
  var self = this;

  // Set up the canvas element
  this.setup = function()
  {
    console.log(Meteor.status());
    canvas = document.getElementById('canvasboard');
    ctx    = canvas.getContext('2d');

    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.scale(1, 1);

    grid = [];
    pixelSize = 30;

    // how many cells fit on the canvas
    w = ~~ (canvas.width / pixelSize);
    h = ~~ (canvas.height / pixelSize);

    this.resetGrid();

    this.canvasGrid = new canvasGrid("canvasboard", grid, pixelSize, pixelSize);
  }

  // Start | Reset the grid
  this.resetGrid = function()
  {
    for(var i=0; i<h; i++) {
        for(var j=0; j<w; j++) {
            if(!grid[i])
                grid[i] = [];

            grid[i][j] = '#CCC';
        }
    }
  }

  // Events
  this.setupEvents = function()
  {
    $(canvas).click(function(e) {
        var colorPixel = "black";

        // quick fill function to save repeating myself later
        function fill(s, gx, gy) {
            ctx.fillStyle = s;
            ctx.fillRect(gx * pixelSize, gy * pixelSize, pixelSize, pixelSize);
        }

        // get mouse click position
        var mx = e.offsetX;
        var my = e.offsetY;

        // calculate grid square numbers
        var gx = ~~ (mx / pixelSize);
        var gy = ~~ (my / pixelSize);

        // make sure we're in bounds
        if (gx < 0 || gx >= w || gy < 0 || gy >= h) {
            return;
        }

        // Db
        var pixel = PixelBoardsCollection.findOne({x: gx, y: gy});
        if(pixel) {
          colorPixel = "green";
          PixelBoardsCollection.update(
            pixel._id,
            {$set: {color : colorPixel}}
          );
        } else {
          PixelBoardsCollection.insert({x: gx, y: gy, color: colorPixel});
        }

        // Local array
        if (grid[gy] && grid[gy][gx]) {
          grid[gy][gx] = colorPixel;
        }
    });
  }

  // Set up listeners for the draw method
  this.startUpdateListener = function()
  {
    // Each time we interact with PixelBoardsCollection this method is call
    Deps.autorun(function()
    {
      var pixels = PixelBoardsCollection.find({});

      _.each(pixels.fetch(), function(item) {
        grid[item.y][item.x] = item.color; // Trigger the redraw
      });

      if(pixels.count() == 0) {
        self.resetGrid();
        self.canvasGrid.draw();
      }
    });
  }
}

