var ITEMS_LIMIT = 10;
Session.setDefault('itemsLimit', ITEMS_LIMIT);
Deps.autorun(function() {
    Meteor.subscribe('boards', Session.get('itemsLimit'));
});

Template.boardsList.events({
    'click #showMoreResults': function(e) {
        e.preventDefault();
        Session.set("itemsLimit", Session.get("itemsLimit") + ITEMS_LIMIT);
        // TODO Change limit in url
    }
})
Template.boardsList.helpers({
    boards: function() {
        return BoardsCollections.find({}, {sort: {createdAt: -1}});
    },
    author: function() {
        return Meteor.users.findOne(this.userId);
    },
    moreResults: function() {
        // If, once the subscription is ready, we have less rows than we
        // asked for, we've got all the rows in the collection.
        return !(BoardsCollections.find().count() < Session.get("itemsLimit"));
    }
});
