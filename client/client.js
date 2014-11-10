if (Meteor.isClient) {
    // This method runs EVERY time the client is opened, which includes page refreshes.
    Meteor.startup(function()
    {
        Meteor.subscribe("boards");
        Meteor.subscribe("pixels", function() {
            $('#loader').hide('slow'); // TODO use loading template with iron router
        });
    });
}
