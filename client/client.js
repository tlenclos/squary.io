Meteor.startup(function(){
    Meteor.subscribe('onlineUsers');
});

HistoryCollection = new Meteor.Collection(null); // Local collection
