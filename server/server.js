// Methods
Meteor.methods({
    getChangelog: function() {
        var url = "https://raw.githubusercontent.com/tlenclos/Pixelboard/master/CHANGELOG.md";
        return HTTP.get(url);
    }
});


// Pub / sub
Meteor.publish("pixels", function(boardId) {
    return PixelsCollection.find({boardId: boardId});
});
Meteor.publish("boards", function() {
    return BoardsCollections.find({}, {sort: {createdAt: -1}});
});
Meteor.publish("board", function(boardId) {
    return BoardsCollections.find({_id: boardId});
});
Meteor.publish("boardUser", function(boardId) {
    var board = BoardsCollections.findOne({_id: boardId});
    return Meteor.users.find({_id: board.userId}, {fields: {_id: 1, profile: 1}});
});

Meteor.publish('onlineUsers', function() {
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

    SyncedCron.start();
});
