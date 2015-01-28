(function(globals){
    'use strict';

    globals.Header = function (_canvas, _hoverElement) {
        this.canvas = _canvas;
        this.hoverElement = _hoverElement;
        this.ctx = _canvas.getContext('2d');
        this.pixelSize = 20;
        this.opacity = 0.8;
        this.colors = [
            '#737A96', '#9A9EB9', '#1E2035', '#393C5B', '#343854', '#1C1E31', '#424663', '#0D101C', '#0D101C',
            '#555665', '#3D3F5E', '#343753'
        ];
        var self = this;

        this.init = function() {
            self.canvas.width = $(self.canvas).width();
            self.canvas.height = $(self.canvas).height();

            $(self.hoverElement).mousemove(function(e) {
                // get mouse click position
                var mx = e.pageX;
                var my = e.pageY;

                // calculate grid square numbers
                var gx = ~~ (mx / self.pixelSize);
                var gy = ~~ (my / self.pixelSize);

                self.drawPixel(gx, gy);
            });

            self.draw();
        };

        this.draw = function () {
            var height = $(self.canvas).height();
            var width = $(self.canvas).width();
            self.canvas.width = width;
            self.canvas.height = height;

            var numberPixelsY = Math.round(height/self.pixelSize);
            var numberPixelsX = Math.round(width/self.pixelSize);

            // Background
            var img     = new Image();
            img.src     = 'header_bg.jpg';

            img.onload  = function() {
                // create pattern
                var imagePattern = self.ctx.createPattern(img, 'repeat'); // Create a pattern with this image, and set it to "repeat".
                self.ctx.fillStyle = imagePattern;
                self.ctx.fillRect(0, 0, width, height);

                // Pixels
                for (var y=0; y<numberPixelsY; y++) {
                    for (var x=0; x<numberPixelsX; x++) {
                        self.drawPixel(x ,y, self.pixelSize);
                    }
                }
            };
        };

        this.getRGBrandomColor = function() {
            var randIndex = parseInt(Math.random() * self.colors.length);
            var color = self.hexToRGB(self.colors[randIndex]);
            return "rgba("+color[0]+", "+color[1]+", "+color[2]+", "+self.opacity+")";
        };

        this.hexToRGB = function(hex) {
            function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
            function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
            function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
            function cutHex(h) {return (h.charAt(0)==="#") ? h.substring(1,7):h}

            return [hexToR(hex), hexToG(hex), hexToB(hex)];
        };

        this.drawPixel = function(x, y) {
            var size = self.pixelSize;

            self.ctx.beginPath();
            self.ctx.rect(x*size, y*size, size, size);
            self.ctx.fillStyle = self.getRGBrandomColor();
            self.ctx.fill();
            self.ctx.lineWidth = 1;
            self.ctx.strokeStyle = self.getRGBrandomColor();
            self.ctx.stroke();
        }

        this.init();
    };
}(this));
