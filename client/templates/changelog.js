Template.changelog.helpers({
    getChangelogMarkdown: function() {
        return Session.get('changelog');
    }
});
