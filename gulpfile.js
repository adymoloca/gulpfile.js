// =========================================================
// gulpfile.js
// Author : Adrian Moloca
// =========================================================
// ------------------------------------------------ requires

'use strict';

var gulp = require('gulp'),
    browserSync = require('browser-sync').create(); // browser Syncronization and reloading 
var rename = require('gulp-rename'); //add the suffix -min- to your CSS and JS files
var sass = require('gulp-sass'); //convert SASS files into CSS files
var cleanCSS = require('gulp-clean-css'); // minify the CSS files
var minifyJS = require("gulp-uglify"); // minify the JS files
var concat = require('gulp-concat'); // create a single file from JS files - better optimization
var imagemin = require('gulp-imagemin'); // Image optimization task
    

// ------------------------------------------------- configs
var paths = {
  sass: {
    src: './sass/**/*.{scss,sass}', //source of your SASS files
    dest: './dist/clean/css', //destination where you want to be your CSS files
    opts: {

    }
  }
  
};

//  GULP TASKS AND PLUGINS

// ---------------------------------------------- Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./" //root directory of your project - where your index file is located
        }
    });
});

// ---------------------------------------------- Convert SASS to CSS
gulp.task('sass', function () {
  return gulp.src(paths.sass.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.sass.dest))
});

// ---------------------------------------------- Minify CSS
gulp.task('minify-css', function () {
    return gulp.src('./dist/clean/css/*.css') //source of your CSS files
   .pipe(cleanCSS())
   .pipe(rename({
    suffix: '.min'
  }))
   .pipe(gulp.dest('./dist/min/css')); // destination of your minified CSS files
});

// ---------------------------------------------- Minify JS
gulp.task('compressJS', function () {
    gulp.src('./dist/clean/js/plugins/*.js') //source of your JS files
    .pipe(minifyJS())
    .pipe(rename({
        suffix: '.min'
      }))
    .pipe(gulp.dest('./dist/min/js/plugins')); // destination of your minified JS files
});

// ---------------------------------------------- Concat the JS in one file
gulp.task('scripts', function() {
  return gulp.src('./dist/min/js/plugins/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/'));
});

// ---------------------------------------------- Image optimization 
gulp.task('image-min', function () {
    gulp.src('./assets/img/*.*')
        .pipe(imagemin([
          imagemin.gifsicle({interlaced: true}),
          imagemin.jpegtran({progressive: true}),
          imagemin.optipng({optimizationLevel: 5}),
          imagemin.svgo({
              plugins: [
                  {removeViewBox: true},
                  {cleanupIDs: false}
              ]
          })
      ]))
        .pipe(gulp.dest('./assets/img-opt/'))
});

// ----------------------------------------------- Gulp Testing Message
gulp.task('message', function(){
  console.log('It works!!');
});

// -------------------------------------------------- Gulp Watch
gulp.task('watch:styles', function () {
  gulp.watch(paths.sass.src, gulp.series('sass'));
});

gulp.task('watch', gulp.series('sass',
  gulp.parallel('watch:styles')
));

// ---------------------------------------------- Default task
gulp.task('default', gulp.series('sass', 
  gulp.parallel('message', 'minify-css' , 'compressJS', 'scripts', 'image-min', 'browser-sync', 'watch')
));
