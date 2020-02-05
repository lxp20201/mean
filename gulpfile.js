/* File: gulpfile.js */

// grab our gulp packages
var fs = require("fs"),
exec = require('child_process').exec;

var gulp = require('gulp'),
gutil = require('gulp-util'),
pump = require('pump');

var
minify = require('gulp-minify'),
uglify = require('gulp-uglify');

var scp = require('gulp-scp2'),
GulpSSH = require('gulp-ssh'),
zip = require('gulp-zip');
//54.255.147.161  /54.169.207.216
var config = {
/*host: '158.175.71.203',
username: 'root',
password: 'E3SUgDpv',
readyTimeout: 99999*/
host: '159.122.224.219',
port: 22,
username: 'root',
password: 'RVbqNY82',
readyTimeout: 99999
/*host: '40.71.248.91', // '54.169.207.216',// '52.77.3.120', //  
username: 'svceng', //'ec2-user',
password: 'Svc@Svceng7!!'*/
/* host: '52.74.235.187',//'52.221.149.147',
  port: 22,
  username: 'ubuntu',//'ec2-user',
  privateKey:fs.readFileSync('/app/docs.ppk')// fs.readFileSync('/app/fl-decydz.ppk')  //*/
/*host: '13.228.59.229',
port: 22,
username: 'ec2-user',
privateKey: fs.readFileSync('/app/fl-decydz.ppk')  //fs.readFileSync('/app/docs.ppk')
*/
}

var gulpSSH = new GulpSSH({
ignoreErrors: false,
sshConfig: config
})


// define the default task and add the watch task to it
gulp.task('default', ['watch']);

gulp.task('compress', function () {
gulp.src(['**/*.js', '/decydz/lib/**/*.js', '!node_modules/**/*.js'])
  .pipe(minify({
    ext: {
      src: '-debug.js',
      min: '.js'
    },
    exclude: ['tasks'],
    ignoreFiles: ['gulpfile.js', '.combo.js', '-min.js']
  }))
  .pipe(gulp.dest('dist'))
});

gulp.task('distclean', function (cb) {
exec(' rm -rf dist/*', function (err, stdout, stderr) {
  console.log(stdout);
  console.log(stderr);
  cb(err);
});
});

gulp.task('compressly', ['distclean'], function (cb) {
pump([
  gulp.src(['./**/*.js', './app.js', '!dist/**/*.js', '!logs/**/*.js', '!node_modules/**/*.js', '!./gulpfile.js']),
  uglify(),
  gulp.dest('dist/src')
],
  cb
);
});


gulp.task('gitmaster', function (cb) {
exec(['git add . && git commit --amend --no-edit && git checkout master && git pull origin master'], function (err, stdout, stderr) {
  console.log(stdout);
  console.log(stderr);
  cb(err);
});
})

gulp.task('zip', ['compressly'], function () {
return gulp.src('dist/src/**/*')
  .pipe(zip('archive.zip'))
  .pipe(gulp.dest('dist/zip'));
});

gulp.task('dest', ['zip'], function () {
return gulp
  .src(['dist/zip/archive.zip'])
  .pipe(gulpSSH.dest('/home/deploy/dataservice'))
});

gulp.task('destalone', function () {
return gulp
  .src(['dist/zip/archive.zip'])
  .pipe(gulpSSH.dest('/home/deploy/dataservice'))
})

gulp.task('deployalone', ['destalone'], function () {
return gulpSSH
  .exec(['sudo rm -rf /decydz/dataservice/*', 'sudo unzip /home/deploy/dataservice/archive.zip -d /decydz/dataservice'], { filePath: 'commands.log' })
  .pipe(gulp.dest('logs'))
})


gulp.task('deploy', ['dest'], function () {
return gulpSSH
  .exec(['sudo rm -rf /decydz/dataservice/*', 'sudo unzip /home/deploy/dataservice/archive.zip -d /decydz/dataservice'], { filePath: 'commands.log' })
  .pipe(gulp.dest('logs'))
})

gulp.task('deployrun', ['deploy'], function () {
return gulpSSH
  .exec(['sudo forever start /decydz/adminservice/users/index.js', 'sudo forever start /decydz/adminservice/connectors/mailer/index.js', 'sudo forever start /decydz/adminservice/api/index.js', 'sudo forever start /decydz/adminservice/datasource/index.js', 'sudo forever start /decydz/adminservice/dashboard/index.js', 'sudo forever start /decydz/adminservice/designer/index.js', 'sudo forever start /decydz/adminservice/modeller/index.js', 'sudo forever start /decydz/adminservice/reports/index.js', 'sudo forever restartall', 'sudo forever list'], { filePath: 'commands.log' })
  .pipe(gulp.dest('logs'))
})

gulp.task('justrun', function () {
return gulpSSH
  .exec(['sudo forever stopall',
    'sudo forever start /decydz/dataservice/app.js',
    'sudo forever start /decydz/adminservice/users/index.js',
    //'sudo forever start /decydz/adminservice/api/index.js',
    'sudo forever start /decydz/adminservice/analytics/index.js',
    'sudo forever start /decydz/adminservice/datasource/index.js',
    'sudo forever start /decydz/adminservice/dashboard/index.js',
    //'sudo forever start /decydz/adminservice/designer/index.js',
    'sudo forever start /decydz/adminservice/modeller/index.js',
    'sudo forever start /decydz/clientservice/dataservice/index.js',
    'sudo forever start /decydz/adminservice/users/index.js',
    //'sudo forever start /decydz/adminservice/reports/index.js',
    'sudo forever list'], { filePath: 'commands.log' })
  .pipe(gulp.dest('logs'))
})

gulp.task('mvdata', function () {
return gulp
  .src(['/tmp/files/*.*'])
  .pipe(gulpSSH.dest('/tmp/files/'));
})


gulp.task('localrun', function () {
  return gulpSSH
    .exec(['sudo forever stopall',
      'sudo forever start /decydz/dataservice/app.js',
      'sudo forever start /decydz/adminservice/users/index.js',
      //'sudo forever start /decydz/adminservice/api/index.js',
      'sudo forever start /decydz/adminservice/analytics/index.js',
      'sudo forever start /decydz/adminservice/datasource/index.js',
      'sudo forever start /decydz/adminservice/dashboard/index.js',
      //'sudo forever start /decydz/adminservice/designer/index.js',
      'sudo forever start /decydz/adminservice/modeller/index.js',
      'sudo forever start /decydz/clientservice/dataservice/index.js',
      'sudo forever start /decydz/adminservice/users/index.js',
      //'sudo forever start /decydz/adminservice/reports/index.js',
      'sudo forever list'], { filePath: 'commands.log' })
    .pipe(gulp.dest('logs'))
  })
  

/*
gulp.task('deploy', ['dest'], function () {
return gulpSSH
.exec([' rm -rf /decydz/adminservice/*', ' unzip /home/svceng/deploy/adminservice/archive.zip -d /decydz/adminservice'], { filePath: 'commands.log' })
.pipe(gulp.dest('logs'))
})

gulp.task('deployrun', ['deploy'], function () {
return gulpSSH
.exec([' forever start /decydz/adminservice/users/index.js', ' forever start /decydz/adminservice/connectors/mailer/index.js', ' forever start /decydz/adminservice/api/index.js', ' forever start /decydz/adminservice/datasource/index.js', ' forever start /decydz/adminservice/dashboard/index.js', ' forever start /decydz/adminservice/designer/index.js', ' forever start /decydz/adminservice/modeller/index.js', ' forever start /decydz/adminservice/reports/index.js', ' forever restartall', ' forever list'], { filePath: 'commands.log' })
.pipe(gulp.dest('logs'))
})

gulp.task('justrun', function () {
return gulpSSH
.exec([' forever stopall', ' forever start /decydz/adminservice/users/index.js',
  ' forever start /decydz/adminservice/api/index.js',
  ' forever start /decydz/adminservice/analyzer/index.js',
  ' forever start /decydz/adminservice/datasource/index.js',
  ' forever start /decydz/adminservice/dashboard/index.js',
  ' forever start /decydz/adminservice/designer/index.js',
  ' forever start /decydz/adminservice/modeller/index.js',
  ' forever start /decydz/dataservice/app.js',
  ' forever start /decydz/adminservice/reports/index.js',
  ' forever start /decydz/clientservice/dataservice/index.js',
  ' forever list'], { filePath: 'commands.log' })
.pipe(gulp.dest('logs'))
})

*/

