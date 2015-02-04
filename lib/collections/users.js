Meteor.users.attachSchema(new SimpleSchema({
    emails: {
        type: [Object],
        // this must be optional if you also use other login services like facebook,
        // but if you use only accounts-password, then it can be required
        optional: true
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    createdAt: {
        type: Date
    },
    profile: {
        type:  new SimpleSchema({
            name: {
                type: String,
                label: "Name"
            }
        })
    },
    status: {
        type: Object,
        optional: true,
        blackbox: true
    },
    services: {
        type: Object,
        optional: true,
        blackbox: true
    }
}));
