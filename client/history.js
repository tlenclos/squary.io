(function(globals){
    'use strict';

    /*
     * History object managing the actions of the user
     */
    globals.History = function() {
        this.done = this.reverted = [];
        var self = this;

        this.add = function(_actionType, _object) {
            self.done.push({
                action: _actionType,
                object: _object
            });

            // delete anything forward
            self.reverted = [];
        };

        this.undo = function() {
            var item = self.done.pop();

            if (item) {
                self.reverted.push(item);
            }

            return item;
        };

        this.redo = function() {
            var item = self.reverted.pop();

            if (item) {
                self.done.push(item);
            }

            return item;
        };
    };
}(this));
