var gulp 		= require('gulp'), // responsavel pelo processo de build
	browserSync = require('browser-sync'),
	gutil		= require('gulp-util'), // mostrar mensagens de log no console sobre o processo de build
	source		= require('vinyl-source-stream'), // gerenciar o source stream
	browserify	= require('browserify'), // responsável por definir qual parte do código pertence a qual parte via require
	watchify	= require('watchify'), // recompila o código assim que alguma mudança é detectada
	reactify	= require('reactify'); // transform jsx files in js

gulp.task('react', function() {
  var bundler = watchify(browserify({
	entries: ['./app/src/jsx/app.jsx'], 
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
	  .pipe(gulp.dest('./build/js'));
  };
  build();
  bundler.on('update', build);
});

gulp.task('browser-sync', function () {
   var files = [
      'app/**/*.html'
   ];

   browserSync.init(files, {
      server: {
         baseDir: 'build/'
      }
   });
});

gulp.task('html', function () {
  gulp.src('app/**/*.html')
	.pipe(gulp.dest('build/'))
});

gulp.task('watch', function () {
  gulp.watch(['app/**/*.html'], ['html']);
  //gulp.watch(['app/src/jsx/**/*.jsx'], ['react']);
});


gulp.task('default', ['html', 'react', 'browser-sync']);