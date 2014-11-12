Meteor.startup(function(){
    Meteor.publish("pixels", function() {
        return PixelsCollection.find({});
    });
    Meteor.publish("boards", function() {
        return BoardsCollections.find({});
    });

    Meteor.publish(null, function() {
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

    Meteor.methods({
        createBoard: function() {
            var userId = Meteor.userId();
            if (!userId) {
                throw new Meteor.Error(401, 'Please login before creating a board.');
            }

            return BoardsCollections.insert({title: 'My pixel art', userId: userId});;

        },
        deleteBoard: function(id) {
            check(id, String);

            var board = BoardsCollections.findOne(id);
            if (board.userId != Meteor.userId()) {
                throw new Meteor.error(401, 'You are not allowed to do that o_O');
            }

            PixelsCollection.remove({boardId: id});
            BoardsCollections.remove({_id: id});

            return true;
        }
    });

    // Configure oauth accounts
    var configureService = function(name, config) {
        console.log("Configuring "+name+" oauth");

        // first, remove configuration entry in case service is already configured
        ServiceConfiguration.configurations.remove({
            service: name
        });

        ServiceConfiguration.configurations.insert({
            service: name,
            appId: config.clientId,
            secret: config.secret
        });
    };

    if (Meteor.settings.facebook) {
        configureService("facebook", Meteor.settings.facebook);
    }
    if (Meteor.settings.google) {
        configureService("google", Meteor.settings.google);
    }
});
