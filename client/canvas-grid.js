function canvasGrid (canvasId, dataMatrix, customWidth, customHeight) {

    var c = document.getElementById(canvasId);
    var ctx = c.getContext("2d");

    function draw() {
        var mHeight = dataMatrix.length;
        var mWidth = matrixWidth();
        var cellHeight = customHeight || c.height / mHeight;
        var cellWidth = customWidth || c.width / mWidth;

        for(var i in dataMatrix)
        {
            for (var j in dataMatrix[i])
            {
                ctx.fillStyle = dataMatrix[i][j];
                ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
            }
        }
    }
    draw();

    //Object.observe(dataMatrix, function () {
    watch(dataMatrix, function () {
        draw();
    });

    function matrixWidth() {
        var w = 0;
        for (var i in dataMatrix) {
            if(w < dataMatrix[i].length)
                w = dataMatrix[i].length;
        };
        return w;
    }
}