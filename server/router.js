var fs = Npm.require('fs');

// Serve generated files
Router.map(function() {
    this.route('serverFile', {
        where: 'server',
        path: /^\/board_image\/(.*)$/,
        action: function() {
            var filePath = process.env.PWD + '/.generated/' + this.params[0];

            try {
                var data = fs.readFileSync(filePath);
                this.response.writeHead(200, {
                    'Content-Type': 'image'
                });
                this.response.write(data);
            } catch (e) {
                console.error(e);
            }

            this.response.end();
        }
    });
});
