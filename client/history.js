(function(globals){
    'use strict';

    /*
     * History object managing the actions of the user
     */
    globals.History = function () {
        this.current = null;
        this.endOfHistory = false;
        this.count = 0;
        var self = this;

        this.getLast = function() {
            return HistoryCollection.findOne({}, {sort: {index: 1}});
        };

        this.add = function(_actionType, _object) {
            self.count += 1;
            self.current = self.count;

            HistoryCollection.insert({
                index: self.count,
                action: _actionType,
                object: _object
            });
        };

        // Move backward in history
        this.previous = function() {
            var criterias = self.current ? {index: {"$lte": self.current}} : {};
            var previous = HistoryCollection.find(criterias, {sort: {index: -1}, limit:2}).fetch();
            if (previous.length == 0)
                return null;

            self.current = previous.length > 1 ? previous[1].index : previous[0].index;

            // End of history
            if (previous.length == 1 && self.getLast().index == self.current && self.endOfHistory) {
                return null;
            } else if (previous.length == 1 && self.getLast().index == self.current) {
                self.endOfHistory = true;
            } else {
                self.endOfHistory = false;
            }

            return previous[0];
        };

        // Move forward in history
        this.next = function() {
            var criterias = self.current ? {index: {"$gt": self.current}} : {};
            var next = HistoryCollection.find(criterias, {sort: {index: 1}, limit:1}).fetch();

            next = next.length > 0 ? next[0] : null;

            if (next) {
                self.current = next.index;
            }

            return next;
        };
    };
}(this));
