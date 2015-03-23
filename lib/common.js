UserConnections = new Meteor.Collection("user_status_sessions");

// Accounts
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');

AccountsTemplates.configure({
    showForgotPasswordLink: true,
    overrideLoginErrors: false,
    enablePasswordChange: true,
    negativeFeedback: true
});

Tools = {};

// http://www.w3.org/TR/AERT#color-contrast
Tools.rgbStringToRgbOject = function(rgbStr) {
    var rgbStr = rgbStr.substring(4, rgbStr.length-1)
        .replace(/ /g, '')
        .split(',');

    return {r:rgbStr[0], g:rgbStr[1], b:rgbStr[2]};
};
Tools.getContrastForRgb = function (rgb) {
    if (_.isString(rgb)) {
        rgb = Tools.rgbStringToRgbOject(rgb);
    }

    return Math.round(((parseInt(rgb.r) * 299) + (parseInt(rgb.g) * 587) + (parseInt(rgb.b) * 114)) /1000);
};
Tools.getTextColorForRgb = function(rgb) {
    console.log(rgb);
    if (Tools.getContrastForRgb(rgb) > 125) {
        return '#000';
    } else {
        return '#FFF';
    }
};
