var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var pkg = require('./package.json');

// Copy vendor files from /node_modules into /vendor
// NOTE: requires `npm install` before running!
gulp.task('copy', function() {
  gulp.src([
      'node_modules/bootstrap/dist/**/*',
      '!**/npm.js',
      '!**/bootstrap-theme.*',
      '!**/*.map'
    ])
    .pipe(gulp.dest('vendor/bootstrap'))

  gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest('vendor/jquery'))
})

// Default task
gulp.task('default', ['copy']);

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: ''
    },
  })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync'], function() {
  // Reloads the browser whenever HTML or CSS files change
  gulp.watch('css/*.css', browserSync.reload);
  gulp.watch('*.html', browserSync.reload);
});


// VARIABLES
const magicalUnderlines = Array.from(document.querySelectorAll('.underline--magical'));

const gradientAPI = 'https://gist.githubusercontent.com/wking-io/3e116c0e5675c8bcad8b5a6dc6ca5344/raw/4e783ce3ad0bcd98811c6531e40256b8feeb8fc8/gradient.json';

// HELPER FUNCTIONS

// 1. Get random number in range. Used to get random index from array.
const randNumInRange = max => Math.floor(Math.random() * (max - 1));

// 2. Merge two separate array values at the same index to 
// be the same value in new array.
const mergeArrays = (arrOne, arrTwo) => arrOne
  .map((item, i) => `${item} ${arrTwo[i]}`)
  .join(', ');

// 3. Curried function to add a background to array of elms
const addBackground = (elms) => (color) => {
  elms.forEach(el => {
    el.style.backgroundImage = color;
  });
}
// 4. Function to get data from API
const getData = async(url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.data;
}

// 5. Partial Application of addBackground to always apply 
// background to the magicalUnderlines constant
const addBackgroundToUnderlines = addBackground(magicalUnderlines);

// GRADIENT FUNCTIONS

// 1. Build CSS formatted linear-gradient from API data
const buildGradient = (obj) => `linear-gradient(${obj.direction}, ${mergeArrays(obj.colors, obj.positions)})`;

// 2. Get single gradient from data pulled in array and
// apply single gradient to a callback function
const applyGradient = async(url, callback) => {
  const data = await getData(url);
  const gradient = buildGradient(data[randNumInRange(data.length)]);
  callback(gradient);
}

// RESULT
applyGradient(gradientAPI, addBackgroundToUnderlines);