var express = require('express');
// create an express app
var app = express();
app.use(express.static(__dirname));
app.get('/', function(req, res) {
res.sendFile('index.html', { root: __dirname });
});
app.get('/madLib', function(req, res) {
	res.sendFile('madLib.html', { root: __dirname });
	console.log("success");
});
// http://localhost:8080/
app.listen(8080);