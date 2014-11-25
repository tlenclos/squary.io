(function(globals){
    'use strict';

    /*
     * History object managing the actions of the user
     * TODO Refactor after creating some tests
     * TODO Bug, when we go previous and then next, one call does nothing
     */
    globals.History = function () {
        this.current = null;
        this.endHistory = false;
        this.count = 0;
        var self = this;

        this.add = function(_actionType, _object) {
            self.current = self.count;

            HistoryCollection.insert({
                index: self.count,
                action: _actionType,
                object: _object
            });

            self.count += 1;
        };

        this.getCurrentAction = function() {
            return HistoryCollection.findOne({index: self.current});
        };

        this.getPreviousAction = function() {
            return HistoryCollection.findOne({index: self.current-1});
        };

        this.getNextAction = function() {
            return HistoryCollection.findOne({index: self.current+1});
        };

        // Move backward in history
        this.previous = function() {
            var current = self.getCurrentAction();
            var previous = self.getPreviousAction();

            if (self.endHistory == -1) {
                return;
            }

            if (previous) {
                self.endHistory = false;
                self.current = previous.index;
            } else {
                self.endHistory = -1;
                self.current = 0;
            }

            return current;
        };

        // Move forward in history
        this.next = function() {
            var current = self.getCurrentAction();
            var next = self.getNextAction();

            if (self.endHistory == 1) {
                return;
            }

            if (next) {
                self.endHistory = false;
                self.current = next.index;
            } else {
                self.endHistory = 1;
                self.current = current.index;
            }

            return current;
        };
    };
}(this));
