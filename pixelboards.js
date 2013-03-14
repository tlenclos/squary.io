// TODO : Change global variables

// Set up a collection to contain board information. On the server,
// it is backed by a MongoDB collection named "pixelboards".
PixelBoardsCollection = new Meteor.Collection("pixelboards");

// Board Class
function PixelBoards ()
{
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

    for(var i=0; i<h; i++) {
        for(var j=0; j<w; j++) {
            if(!grid[i])
                grid[i] = [];

            grid[i][j] = '#CCC';
        }
    }

    canvasGrid("canvasboard", grid, pixelSize, pixelSize);
  }

  // Events
  this.setupEvents = function()
  {
    var self = this;

    $(canvas).click(function(e) {
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

        var colorPixel = "black";
        PixelBoardsCollection.insert({x: gx, y: gy, color: colorPixel});

        if (grid[gy] && grid[gy][gx]) {
          grid[gy][gx] = colorPixel;
        }

        // TODO : Update if pixel already exist
        // PixelBoardsCollection.update({x: gx, y: gy, color: "black"});
    });
  }

  // Set up listeners for the draw method
  this.startUpdateListener = function()
  {
    var self = this;
    Deps.autorun(function()
    {
      var pixels = PixelBoardsCollection.find({});
      console.log('Draw '+pixels.count()+ ' pixels');

      _.each(pixels.fetch(), function(item) {
        grid[item.y][item.x] = item.color; // Trigger the redraw
      });
    });
  }
}

