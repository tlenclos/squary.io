Template.headerMini.rendered = function() {
    var header = new headerCanvas(document.getElementById('header-canvas'), document.getElementById('header-mini'));

    $(window).resize(function() {
        header.draw();
    });
};
