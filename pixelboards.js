// TODO : Change global variables
// Set up a collection to contain board information. On the server,
// it is backed by a MongoDB collection named "pixelboards".

// Board Class
function PixelBoards ()
{
    this.defaultColorPixel = "#CCC";
    var self = this;

    // Set up the canvas element
    this.setup = function()
    {
        grid = [];
        pixelSize = 30;
        canvas = document.getElementById('canvasboard');
        layer  = document.getElementById('layer');

        ctx    = canvas.getContext('2d');
        ctxLayer = layer.getContext('2d');

        ctx.canvas.width  = ctxLayer.canvas.width = window.innerWidth;
        ctx.canvas.height = ctxLayer.canvas.height = window.innerHeight;

        ctx.scale(1, 1);
        ctxLayer.scale(1, 1);

        // how many cells fit on the canvas
        w = ~~ (canvas.width / pixelSize);
        h = ~~ (canvas.height / pixelSize);

        this.resetGrid();
    }

    // Start | Reset the grid
    this.resetGrid = function()
    {
        for (var i=0; i<h; i++) {
            for (var j=0; j<w; j++) {
                if (!grid[i])
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

        $(layer).mousemove(function(e) {
            // Layer test
            var positions = self.getPixelIndexes(e);

            if (positions) {
                ctxLayer.clearRect(0, 0, ctxLayer.canvas.width, ctxLayer.canvas.height);
                ctxLayer.fillStyle = '#FFF';
                ctxLayer.fillRect(positions[0]*pixelSize, positions[1]*pixelSize, pixelSize, pixelSize);
            }
        });

        $(document).mousedown(function(e) {
            var positions = self.getPixelIndexes(e);
            var gx = positions[0];
            var gy = positions[1];
            var pixel = PixelBoardsCollection.findOne({x: gx, y: gy});

            if (e.which == 1) { // Mouse left
                var colorPixel = $('.colorCanvasInput').css('background-color');

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
                if(!grid[item.y])
                    grid[item.y] = [];

                grid[item.y][item.x] = item.color; // Trigger the redraw
            });

            if (pixels.count() == 0) {
                self.resetGrid();
            }

            self.draw();
        });
    }

    this.draw = function() {
        var mHeight = grid.length;
        var mWidth = matrixWidth();
        var cellHeight = pixelSize || canvas.height / mHeight;
        var cellWidth = pixelSize || canvas.width / mWidth;

        for (var i in grid) {
            for (var j in grid[i]) {
                ctx.fillStyle = grid[i][j];
                ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
            }
        }
    }

    function matrixWidth() {
        var w = 0;
        for (var i in grid) {
            if (w < grid[i].length)
                w = grid[i].length;
        };
        return w;
    }
}

