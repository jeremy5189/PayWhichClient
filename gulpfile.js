var gulp = require('gulp'),
    gulpCopy = require('gulp-file-copy');

gulp.task('copy', function() {
  gulp.src('./bower_components/jquery/jquery.min.js')
      .pipe(gulp.dest('./js/lib/'));

  gulp.src('./jquery-mobile/jquery.mobile-1.4.5.js')
       .pipe(gulp.dest('./js/lib/'));

  gulp.src('./bower_components/moment/min/moment-with-locales.min.js')
       .pipe(gulp.dest('./js/lib/'));

  gulp.src('./bower_components/local-storage/src/LocalStorage.js')
       .pipe(gulp.dest('./js/lib/'));

  gulp.src('./jquery-mobile/jquery.mobile-1.4.5.css')
       .pipe(gulp.dest('./css/lib/'));

  gulp.src('./jquery-mobile/images/ajax-loader.gif')
      .pipe(gulp.dest('./js/lib/images/'));

  gulp.src('./bower_components/jquery-jsonp/src/jquery.jsonp.js')
      .pipe(gulp.dest('./js/lib/'));
});
