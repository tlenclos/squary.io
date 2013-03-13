// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

PixelBoardsCollection = new Meteor.Collection("pixelboards");

// Board Class
function PixelBoards ()
{
  // Set up the canvas element
  this.setup = function()
  {
    console.log(Meteor.status());
    canvas = document.getElementById('canvas');
    ctx    = canvas.getContext('2d');

    var board = PixelBoardsCollection.findOne();
    var color = board ? board.color : null;
    this.drawBackground(color);
  }

  // Events
  this.setupEvents = function()
  {
    var self = this;
    canvas.addEventListener('click', function(e)
    {
      var board = PixelBoardsCollection.findOne();
      var color = board.color === "#111" ? "#CCC" : "#111";
      PixelBoardsCollection.update(board._id, {$set: {color: color}});
    });
  }

  // Set up listeners for the draw method
  this.startUpdateListener = function()
  {
    var self = this;
    var redrawCanvas = function()
    {
      var context = new Meteor.deps.Context()
      context.on_invalidate(redrawCanvas)

      context.run(function()
      {
        self.drawBackground(PixelBoardsCollection.findOne().color);
      })
    }
    redrawCanvas()
  }

  // Draw background
  this.drawBackground = function(color) {
    if (color) {
      ctx.fillStyle   = color;
    }
    ctx.fillRect (0, 0, 200, 200);
  }

  this.resetBoard = function() {
    PixelBoardsCollection.remove({});
    PixelBoardsCollection.insert({color: "#CCC"});
  }
}

