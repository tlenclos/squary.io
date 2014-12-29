var convertToHex = function(value) {
    var val=(value*1).toString(16);
    val=(val.length>1)?val:"0"+val;
    return val;
};

// Methods
Meteor.methods({
    getChangelog: function() {
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
        var jpedLib = Meteor.npmRequire('jpeg-js');
        var fs = Npm.require('fs');
        var pixels = PixelsCollection.find({boardId: boardId});
        var height = 0, width = 0;
        var basePath = Meteor.chroot || (process.env['PWD'] +'/public');
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
                    var pixel = pixelsArray[pixelX][pixelY];
                    var rgb = pixel.color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                    var red = convertToHex(rgb[1]);
                    var green = convertToHex(rgb[2]);
                    var blue = convertToHex(rgb[3]);

                    frameData[i++] = '0x'+red; // red
                    frameData[i++] = '0x'+green; // green
                    frameData[i++] = '0x'+blue; // blue
                    frameData[i++] = 0xFF; // alpha - ignored in JPEGs
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
            var jpegImageData = jpedLib.encode(rawImageData, 100);

            var imagePath = 'images/board/preview_'+boardId+'.jpg';
            var fileName = basePath+'/'+imagePath;
            fs.writeFile(fileName, jpegImageData.data, 'binary', Meteor.bindEnvironment(function(err) {
                if (err) {
                    console.log(err);
                    throw (new Meteor.Error(500, 'Failed to save file.', err));
                } else {
                    console.log('The file ' + fileName + ' was saved');
                    BoardsCollections.update(boardId, {$set:{thumbnail: imagePath}});
                }
            }));
        }
    }
});


// Pub / sub
Meteor.publish("pixels", function(boardId) {
    this.unblock();
    return PixelsCollection.find({boardId: boardId});
});
Meteor.publish("boards", function(limit) {
    this.unblock();
    limit = limit || 10;

    var options = {
        sort: {createdAt: -1},
        limit: limit
    };

    var boardsCursor = BoardsCollections.find({}, options);
    var userIds = boardsCursor.map(function (board) {
        return board.userId;
    });

    return [
        boardsCursor,
        Meteor.users.find({_id: {$in: userIds}})
    ];
});
Meteor.publish("board", function(boardId) { // TODO Merge the user in this subscription
    this.unblock();
    return BoardsCollections.find({_id: boardId});
});
Meteor.publish("boardOwner", function(userId) {
    this.unblock();
    return Meteor.users.find({_id: userId}, {fields: {_id: 1, profile: 1}});
});

Meteor.publish('onlineUsers', function() {
    this.unblock();

    return [
        Meteor.users.find({
            "status.online": true
        }, {
            fields: {
                status: 1,
                username: 1
            }
        }), UserStatus.connections.find()
    ];
});


// Startup work
Meteor.startup(function(){
    // Mongo indexes
    console.log('Ensure index mongo DB');
    BoardsCollections._ensureIndex({createdAt:1});

    // Configure oauth accounts
    var configureService = function(name, config) {
        console.log("Configuring "+name+" oauth");

        // first, remove configuration entry in case service is already configured
        ServiceConfiguration.configurations.remove({
            service: name
        });

        var data = {
            service: name,
            secret: config.secret,
            loginStyle: 'popup'
        };

        if (name == 'facebook') {
            data.appId = config.clientId;
        } else if (name == 'google') {
            data.clientId = config.clientId;
        }

        ServiceConfiguration.configurations.insert(data);
    };

    if (Meteor.settings.facebook) {
        configureService("facebook", Meteor.settings.facebook);
    }
    if (Meteor.settings.google) {
        configureService("google", Meteor.settings.google);
    }

    // Cronjobs
    SyncedCron.add({
        name: 'Clear boards not linked to a user',
        schedule: function(parser) {
            return parser.text('at 01:00 am');
        },
        job: function() {
            var boardsWithoutUser = BoardsCollections.find({userId: null}).fetch();
            _.each(boardsWithoutUser, function(board) {
                PixelsCollection.remove({boardId: board._id});
                BoardsCollections.remove({_id: board._id});
            });

            return true;
        }
    });
    SyncedCron.add({
        name: 'Render recently updated board',
        schedule: function(parser) {
            return parser.text('every 5 minutes');
        },
        job: function() {
            Meteor.call('renderAllBoardImage');
            return true;
        }
    });

    SyncedCron.start();
});
