var gulp 		= require('gulp'), // responsavel pelo processo de build
	browserSync = require('browser-sync'),
	gutil		= require('gulp-util'), // mostrar mensagens de log no console sobre o processo de build
	source		= require('vinyl-source-stream'), // gerenciar o source stream
	browserify	= require('browserify'), // responsável por definir qual parte do código pertence a qual parte via require
	watchify	= require('watchify'), // recompila o código assim que alguma mudança é detectada
	reactify	= require('reactify'), // transform jsx files in js
	notifier	= require('node-notifier');

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: "build"
        }    
    })
});

gulp.task('watch', function () {
    var bundler = watchify(browserify({
		entries: ['./app/src/jsx/app.jsx'], 
		transform: [reactify],
		extensions: ['.jsx'],
		debug: true,
		cache: {},
		packageCache: {},
		fullPaths: true
	}, watchify.args))
        .on('update', function () { gutil.log('Rebundling...'); })
        .on('time', function (time) {
            gutil.log('Rebundled in:', gutil.colors.cyan(time + 'ms'));
        });

    bundler.transform(reactify);
    bundler.on('update', rebundle);

    function rebundle() {
        return bundler.bundle()
            .on('error', function (err) {
                gutil.log(err);
                notifier.notify({ title: 'Browserify Error', message: 'Something went wrong :/' });
            })
        	.pipe(source('main.js'))
        	.pipe(gulp.dest('./build/js'))
        	.pipe(browserSync.reload({ stream: true }));
    }

    return rebundle();
});

gulp.task('default', ['watch', 'browser-sync']);