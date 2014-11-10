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
        deleteBoard: function(id) {
            check(id, String);
            PixelsCollection.remove({boardId: id});
            BoardsCollections.remove({_id: id});

            console.log('Delete board '+id);
            return true;
        }
    })
});
