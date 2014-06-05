Meteor.startup(function(){
    Meteor.publish("pixels", function() {
        return PixelBoardsCollection.find({});
    });

    Meteor.publish("users", function() {
        return OnlineUsersCollection.find({});
    });

    // Online users (from https://github.com/murilopolese/howmanypeoplearelooking)
    OnlineUsersCollection.remove({});
    Meteor.default_server.stream_server.register( Meteor.bindEnvironment( function(socket) {
        var intervalID = Meteor.setInterval(function() {
            if (socket.meteor_session) {

                var connection = {
                    connectionID: socket.meteor_session.id,
                    connectionAddress: socket.address,
                    userID: socket.meteor_session.userId
                };

                socket.id = socket.meteor_session.id;

                OnlineUsersCollection.insert(connection);

                Meteor.clearInterval(intervalID);
            }
        }, 1000);

        socket.on('close', Meteor.bindEnvironment(function () {
            OnlineUsersCollection.remove({
                connectionID: socket.id
            });
        }, function(e) {
            Meteor._debug("Exception from connection close callback:", e);
        }));
    }, function(e) {
        Meteor._debug("Exception from connection registration callback:", e);
    }));
});