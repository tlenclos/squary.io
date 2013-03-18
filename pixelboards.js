// TODO : Change global variables

// Set up a collection to contain board information. On the server,
// it is backed by a MongoDB collection named "pixelboards".
PixelBoardsCollection = new Meteor.Collection("pixelboards");

// Board Class
function PixelBoards ()
{
  this.canvasGrid = null;
  this.defaultColorPixel = "#CCC";
  var self = this;

  // Set up the canvas element
  this.setup = function()
  {
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
    $(document).on("contextmenu", function(e) {
       return false;
    });

    $(canvas).mousedown(function(e) {
      var positions = self.getPixelIndexes(e);
      var gx = positions[0];
      var gy = positions[1];
      var pixel = PixelBoardsCollection.findOne({x: gx, y: gy});

      if (e.which == 1) { // Mouse left
        var colorPixel = $('.colorCanvasInput').css('background-color');

        // quick fill function to save repeating myself later
        function fill(s, gx, gy) {
            ctx.fillStyle = s;
            ctx.fillRect(gx * pixelSize, gy * pixelSize, pixelSize, pixelSize);
        }

        // Db
        if (pixel) {
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
      } else if(e.which == 3) { // Mouse right
        if (pixel) {
          PixelBoardsCollection.update(
            pixel._id,
            {$set: {color : self.defaultColorPixel}}
          );
          // TODO : Really remove the pixel (problem : how do we remove it from the canvas without x/y data on other clients ?)
          // PixelBoardsCollection.remove({'_id': pixel._id});
          if (grid[gy] && grid[gy][gx]) {
            grid[gy][gx] = self.defaultColorPixel;
          }
        }
      }

      return false;
    });
  }

  this.getPixelIndexes = function(e)
  {
    // get mouse click position
    var mx = e.pageX;
    var my = e.pageY;

    // calculate grid square numbers
    var gx = ~~ (mx / pixelSize);
    var gy = ~~ (my / pixelSize);

    // make sure we're in bounds
    if (gx < 0 || gx >= w || gy < 0 || gy >= h) {
        return;
    }

    return [gx, gy];
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

      $('#loader').hide('slow');
    });
  }
}

