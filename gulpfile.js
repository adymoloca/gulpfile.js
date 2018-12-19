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
  return gulp.src(paths.sass.src) //source of your SASS files
    .pipe(sass().on('error', sass.logError)) // convert SASS into CSS
    .pipe(gulp.dest(paths.sass.dest)) // destionation where will be CSS files
});

// ---------------------------------------------- Minify CSS
gulp.task('minify-css', function () {
    return gulp.src('./build/css/eliza-app.css') //source of your CSS files
   .pipe(cleanCSS()) // minifying CSS files
   .pipe(rename({ 
    suffix: '.min' // adding the suffix for minified CSS files
  }))
   .pipe(gulp.dest('./dist/css/')) // destination of your minified CSS files
   .pipe(browserSync.stream()); // Sync with browser for modification
});

// ---------------------------------------------- Minify JS
gulp.task('compressJS', function () {
    gulp.src('./src/pluginsJS/*.js') //source of your JS files
    .pipe(minifyJS()) // minifying JS files
    .pipe(rename({
        suffix: '.min' // adding the suffix for minified JS files
      }))
    .pipe(gulp.dest('./build/js/')) // destination of your minified JS files
    .pipe(browserSync.stream()); // Sync with browser 
});

// ---------------------------------------------- Concat the JS in one file
gulp.task('scripts', function() {
  return gulp.src('./build/js/*.js') //source of all your JS files - plugins
    .pipe(concat('all.js')) // concat all JS files into one single file - call the file as you want
    .pipe(gulp.dest('./dist/js/')) // destination of your JS file
    .pipe(browserSync.stream()); // Sync with browser 
});

// ---------------------------------------------- Image optimization 
gulp.task('image-min', function () {
    gulp.src('./src/img/*.*') //source folder of your Images 
        .pipe(imagemin([ // plugin for image optimization
          imagemin.gifsicle({interlaced: true}), // GIF files optimizatioon
          imagemin.jpegtran({progressive: true}), // JPEG files optimization
          imagemin.optipng({optimizationLevel: 5}), // PNG files optimization
          imagemin.svgo({ // SVG files optimization 
              plugins: [
                  {removeViewBox: true},
                  {cleanupIDs: false}
              ]
          })
      ]))
        .pipe(gulp.dest('./img')) // destination of your optimized images
        .pipe(browserSync.stream()); // Sync with browser
});

// ----------------------------------------------- Gulp Testing Message
gulp.task('message', function(){ 
  console.log('It works!!'); // Receive a message in console when all tasks works fine
});


// ------------------------------------------------ RUN and load all tasks in one
gulp.task('run', ['sass', 'minify-css', 'compressJS', 'scripts', 'image-min', 'browserSync', 'message']); 

// -------------------------------------------------- Gulp Watch
gulp.task('watch', function () {
  gulp.watch(paths.sass.src, ['sass']); // Watch for modification in SASS source files and re-run compiler task into CSS
  gulp.watch('./build/css/*.css', ['minify-css']); // Watch for modification in clean CSS source files and re-run minifying task
  gulp.watch('./src/pluginsJS/*.js', ['compressJS']); // Watch for modifcation in clean JS source files and re-run compression task 
  gulp.watch('./build/js/*.js', ['scripts']); // Watch for modification in compressed JS files and re-run the concat task
  gulp.watch('./src/img/*.*', ['image-min']); // Watch for modification in source of Images files and re-run the optimization task
  gulp.watch('./*.html', browserSync.reload); // Watch for modification in html files from root folder and reload the browser 
});


// ---------------------------------------------- Default task
gulp.task('default',['run', 'watch']); // Default task for gulp 
