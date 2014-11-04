Meteor.startup(function(){
    Meteor.publish("pixels", function() {
        return PixelBoardsCollection.find({});
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
});
