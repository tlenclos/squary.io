var fs = Npm.require('fs');

var convertToHex = function(value) {
    var val = (value * 1).toString(16);
    val = (val.length > 1) ? val : "0" + val;
    return val;
};

// Methods
Meteor.methods({
    getChangelog: function() {
        // TODO Move this path in config
        // TODO Use a cache
        var url = "https://raw.githubusercontent.com/tlenclos/Pixelboard/master/CHANGELOG.md";
        return HTTP.get(url);
    },
    renderAllBoardImage: function() {
        // TODO Render only recently updated board
        var boards = BoardsCollections.find().fetch();
        _.each(boards, function(board) {
            Meteor.call('encodeBoardImage', board._id);
        });
    },
    encodeBoardImage: function(boardId) {
        console.log('Render board '+boardId);

        var jpegLib = Meteor.npmRequire('jpeg-js');
        var pixels = PixelsCollection.find({boardId: boardId});
        var height = 0, width = 0;
        var pixelsArray = [];

        if (pixels.count() > 0) {
            // Determine size of image
            _.each(pixels.fetch(), function(pixel) {
                if (!pixelsArray[pixel.x]) {
                    pixelsArray[pixel.x] = [];
                }
                pixelsArray[pixel.x][pixel.y] = pixel;

                if (pixel.x > width) {
                    width = pixel.x;
                }

                if (pixel.y > height) {
                    height = pixel.y;
                }
            });

            /*
             height = height < 200 ? 200 : ++height;
             width = width < 100 ? 100 : ++width;
             */

            // Encode
            var frameData = new Buffer(width * height * 4);
            var i = 0;
            var pixelY = 0;
            var pixelX = 0;

            while (i < frameData.length) {
                pixelX++;

                if (pixelX >= width) {
                    pixelY++;
                    pixelX = 0;
                }

                if (pixelsArray[pixelX] && pixelsArray[pixelX][pixelY]) {
                    var
                        pixel = pixelsArray[pixelX][pixelY],
                        color = pixel.color,
                        red,
                        green,
                        blue
                    ;

                    try {
                        if (color.indexOf('#') > -1) {
                            red = color.substr(1, 2);
                            green = color.substr(3, 2);
                            blue = color.substr(5, 2);
                        } else {
                            var rgb = pixel.color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                            red = convertToHex(rgb[1]);
                            green = convertToHex(rgb[2]);
                            blue = convertToHex(rgb[3]);
                        }

                        frameData[i++] = '0x'+red; // red
                        frameData[i++] = '0x'+green; // green
                        frameData[i++] = '0x'+blue; // blue
                        frameData[i++] = 0xFF; // alpha - ignored in JPEGs
                    } catch (e) {
                        console.log('Error while reading pixels from database', e);
                        console.log(pixel);
                    }

                } else {
                    frameData[i++] = 0xFF; // red
                    frameData[i++] = 0xFF; // green
                    frameData[i++] = 0xFF; // blue
                    frameData[i++] = 0xFF; // alpha - ignored in JPEGs
                }
            }
            var rawImageData = {
                data: frameData,
                width: width,
                height: height
            };
            var jpegImageData = jpegLib.encode(rawImageData, 100);

            var newFile = new FS.File();
            newFile.attachData(jpegImageData.data, {type: 'image/jpg'}, function(error){
                if (error) throw error;
                newFile.name('preview_'+boardId+'.jpg');

                ImagesCollection.insert(newFile, function (err, fileObj) {
                    if (!err) {
                        console.log('Update preview for board', boardId);
                        BoardsCollections.update(boardId, {$set:{thumbnail: fileObj._id}});
                    }
                });
            });
        }
    }
});
