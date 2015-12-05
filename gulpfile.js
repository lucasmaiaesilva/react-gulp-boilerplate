var gulp 		= require('gulp'), // responsavel pelo processo de build
	gutil		= require('gulp-util'), // mostrar mensagens de log no console sobre o processo de build
	source		= require('vinyl-source-stream'), // gerenciar o source stream
	browserify	= require('browserify'), // responsável por definir qual parte do código pertence a qual parte via require
	watchify	= require('watchify'), // recompila o código assim que alguma mudança é detectada
	reactify	= require('reactify'); // transform jsx files in js

gulp.task('react', function() {
  var bundler = watchify(browserify({
	entries: ['./src/jsx/app.jsx'], 
	transform: [reactify],
	extensions: ['.jsx'],
	debug: true,
	cache: {},
	packageCache: {},
	fullPaths: true
  }));

  function build(file) {
	if (file) gutil.log('Recompiling ' + file);
	return bundler
	  .bundle()
	  .on('error', gutil.log.bind(gutil, 'Browserify Error'))
	  .pipe(source('main.js'))
	  .pipe(gulp.dest('./build'));
  };
  build();
  bundler.on('update', build);
});