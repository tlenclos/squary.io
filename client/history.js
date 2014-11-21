(function(globals){
    'use strict';

    /*
     * History object managing the actions of the user
     */
    globals.History = function () {
        this.add = function(_actionType, _object) {
            HistoryCollection.insert({
                createdAt: new Date().getTime(),
                action: _actionType,
                object: _object
            });
        };

        // Remove an action from the stack
        this.previous = function() {
            var latest = HistoryCollection.find({}, {sort: {createdAt: -1}, limit:1}).fetch();
            latest = latest.length > 0 ? latest[0] : null;

            if (latest) {
                HistoryCollection.remove({_id: latest._id});
            }

            return latest;
        };
    };
}(this));
