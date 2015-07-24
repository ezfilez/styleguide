/**
 * Main Node file
 */
var exec = require('child_process').exec,
	watcher = require('./modules/watcher'),
	livereloader = require('./modules/livereloader'),
	utils = require('./modules/utils'),
	http = require('http'),
	waitingTheServer = true,
	PORT = normalizePort(process.env.STYLEGUIDE_PORT || process.env.PORT || '9241');


function waitTheServer() {
	if(waitingTheServer) {
		http.get({
			host: 'localhost',
			port: PORT,
			path: '/'
		}, function(res) {
			if(res.statusCode == 200) {
				exec('echo "Done! Enjoy!" && echo "PROGRESS:100" && open "http://localhost:' + PORT + '"', utils.puts);
				waitingTheServer = false;
			}
			res.emit('end');
			waitTheServer();
		}).on('error', function(e) {
			// Nothing
			waitingTheServer = true;
			waitTheServer();
		});
	}
}

// Files watcher
watcher.start();

// Livereload server
livereloader.start();

// Initialize Harp
exec('cd ' + utils.basePath + '&& harp server --port ' + PORT, utils.puts);
exec('echo "Starting Server on port ' + PORT + '.." && echo "PROGRESS:94"', utils.puts);
waitTheServer();

// From Express
function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}
