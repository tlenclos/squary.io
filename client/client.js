Meteor.startup(function(){
    Meteor.subscribe('onlineUsers');
});

UI.registerHelper('loggedUser', function() {
    return Meteor.user();
});

AccountsTemplates.addField({
    _id: 'name',
    type: 'text',
    displayName: "Name",
    func: function (value) {
        return value === 'Full Name';
    },
    errStr: 'Only "Full Name" allowed!'
});
