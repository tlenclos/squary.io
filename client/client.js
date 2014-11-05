if (Meteor.isClient) {
    var firstRun = true;

    // This method runs EVERY time the client is opened, which includes page refreshes.
    Meteor.startup(function()
    {
        Meteor.subscribe("boards");
        Meteor.subscribe("pixels", function() {
            $('#loader').hide('slow'); // TODO use loading template with iron router
        });

        Deps.autorun(function() {
            var isConnected = Meteor.status().connected;

            if (isConnected && firstRun) { // TODO Still necessary ?
                Template.board.rendered = function() {
                    var pixelboards = new PixelBoards();
                    pixelboards.setup();
                    pixelboards.setupEvents();
                    pixelboards.startUpdateListener();

                    firstRun = false;
                };
            }
        });
    });
}
