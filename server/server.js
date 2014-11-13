Meteor.startup(function(){
    Meteor.publish("pixels", function() {
        return PixelsCollection.find({});
    });
    Meteor.publish("boards", function() {
        return BoardsCollections.find({});
    });
    Meteor.publish("boardUser", function(boardId) {
        return Meteor.users.find({boardId: boardId});
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
});
