// =========================================================
// gulpfile.js
// Release: December 2018
// Author: Adrian Moloca
// =========================================================
// ------------------------------------------------ requires

'use strict';

var gulp = require('gulp'),
    browserSync = require('browser-sync').create(), // browser Syncronization and reloading 
    rename = require('gulp-rename'), //add the suffix -min- to your CSS and JS files
    sass = require('gulp-sass'), //convert SASS files into CSS files
    cleanCSS = require('gulp-clean-css'), // minify the CSS files
    minifyJS = require("gulp-uglify"), // minify the JS files
    concat = require('gulp-concat'), // create a single file from JS files - better optimization
    imagemin = require('gulp-imagemin'); // Image optimization task
    

// ------------------------------------------------- configs
var paths = {
  sass: {
    src: './src/sass/eliza-app.sass', //source of your SASS files
    dest: './build/css/', //destination where you want to be your CSS files
    opts: {

    }
  }
  
};

//  GULP TASKS AND PLUGINS

// ---------------------------------------------- Static server
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: "./",
            index : "index.html" //root directory of your project - where your index file is located
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
    return gulp.src('./build/css/eliza-app.css') //source of your CSS files
   .pipe(cleanCSS())
   .pipe(rename({
    suffix: '.min'
  }))
   .pipe(gulp.dest('./dist/css/')) // destination of your minified CSS files
   .pipe(browserSync.stream());
});

// ---------------------------------------------- Minify JS
gulp.task('compressJS', function () {
    gulp.src('./src/pluginsJS/*.js') //source of your JS files
    .pipe(minifyJS())
    .pipe(rename({
        suffix: '.min'
      }))
    .pipe(gulp.dest('./build/js/')) // destination of your minified JS files
    .pipe(browserSync.stream());

});

// ---------------------------------------------- Concat the JS in one file
gulp.task('scripts', function() {
  return gulp.src('./build/js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(browserSync.stream());
});

// ---------------------------------------------- Image optimization 
gulp.task('image-min', function () {
    gulp.src('./src/img/*.*')
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
        .pipe(gulp.dest('./img'))
        .pipe(browserSync.stream());
});

// ----------------------------------------------- Gulp Testing Message
gulp.task('message', function(){
  console.log('It works!!');
});

// -------------------------------------------------- Gulp Watch

gulp.task('run', ['sass', 'minify-css', 'compressJS', 'scripts', 'image-min', 'browserSync']);

gulp.task('watch', function () {
  gulp.watch(paths.sass.src, ['sass']);
  gulp.watch('./build/css/*.css', ['minify-css']);
  gulp.watch('./src/pluginsJS/*.js', ['compressJS']);
  gulp.watch('./build/js/*.js', ['scripts']);
  gulp.watch('./src/img/*.*', ['image-min']);
  gulp.watch('./*.html', browserSync.reload);
});


// ---------------------------------------------- Default task
gulp.task('default',['run', 'watch']);
