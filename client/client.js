Meteor.startup(function(){
    Meteor.subscribe('onlineUsers');
    Deps.autorun(function ()
    {
        var message = Session.get('toast');
        if(message) {
            if(message.type === "info") {
                toastr.info(message.msg, message.title);
                Session.set('toast', null);
            }
            else if(message.type === "warning") {
                toastr.warning(message.msg, message.title);
            }
            else if(message.type === "clear") {
                toastr.clear();
            }
        }
    });
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