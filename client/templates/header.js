Template.header.rendered = function() {
    var header = new headerCanvas(document.getElementById('header-canvas'), document.getElementById('header'));

    $(window).resize(function() {
        header.draw();
    });
};

Template.header.events({
    'click #createBoard': function(event, context) {
        event.preventDefault();

        Meteor.call('createBoard', function(error, result) { // display the error to the user and abort
            if (error) {
                return alert(error.reason);
            }

            Router.go('board', {_id: result});
        });
    }
});
