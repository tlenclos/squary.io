HistoryCollection = new Meteor.Collection(null); // Local collection

Meteor.startup(function(){
    Meteor.subscribe('onlineUsers');
});

UI.registerHelper('loggedIn', function() {
    return Meteor.userId();
});
