Meteor.startup(function(){
    Meteor.subscribe('onlineUsers');
});

UI.registerHelper('loggedIn', function() {
    return Meteor.userId();
});

UI.registerHelper('loggedUser', function() {
    return Meteor.user();
});
