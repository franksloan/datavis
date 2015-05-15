var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	express = require('express'),
	lrserver = require('tiny-lr'),
	livereload = require('connect-livereload'),
	livereloadport = 35729,
	port = 3000;

//JSHint task - check for js code quality
gulp.task('lint', function(){
	gulp.src('./app/client/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});

gulp.task('watch', ['lint'], function(){
	var writeError = function(){

	};
	//watch for any changes to js files whilst running
	gulp.watch(['app/client/*.js'],[
		'lint',
		]).on('error', writeError);
});

var server = express();
// reload
server.use(livereload({port: livereloadport}));
// folder to use for root
server.use(express.static('./app'));

server.all('/*', function(req, res){
	res.sendFile('index.html', { root: 'app' });
});

gulp.task('dev', function() {
	console.log('running');
	// start the server
	server.listen(port);
	console.log(lrserver);
	// run live reload
	lrserver.listen(livereloadport);
	// run watch to take care of any changes made
	gulp.start('watch');
});
gulp.task('default', ['lint', 'dev']);