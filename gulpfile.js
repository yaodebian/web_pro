let gulp = require('gulp'); // 必须先引入 gulp 插件
let gulpClean = require('gulp-clean'); // 文件删除
let gulpPostcss = require('gulp-postcss'); // postcss
let px2rem = require('postcss-px2rem'); // 单位转换，如果用了 vscode 就不需要转换，有插件可以使用
let gulpSass = require('gulp-sass'); // sass 编译
let gulpUtil = require('gulp-util'); // 控制台颜色
let gulpCached = require('gulp-cached'); // 缓存当前任务中的文件，只让已修改的文件通过管道
let gulpUglify = require('gulp-uglify'); // js 压缩
let gulpBabel = require('gulp-babel'); // ES6 转换
let es2015 = require('babel-preset-es2015'); // ES5 转换
let gulpRename = require('gulp-rename'); // 重命名
let gulpConcat = require('gulp-concat'); // 合并文件
let gulpNotify = require('gulp-notify'); // 修改提醒
let gulpCssnano = require('gulp-cssnano'); // css 压缩
let gulpImagemin = require('gulp-imagemin'); // 图片优化
let browserSync = require('browser-sync'); // 保存多浏览器自动刷新
let gulpAutoprefixer = require('gulp-autoprefixer'); // 添加 css 浏览器兼容前缀

/* common task */

// 图片压缩
gulp.task('imagemin', function () {
    return gulp.src('dist/img/**/*.{jpg,jpeg,png,gif}', { base: './dist' })
        .pipe(gulpCached('imagemin'))
        // 取值范围：0-7（优化等级）,是否无损压缩jpg图片，是否隔行扫描gif进行渲染，是否多次优化svg直到完全优化
        .pipe(gulpImagemin({ optimizationLevel: 5, progressive: true, interlaced: true, multipass: true }))
        .pipe(gulp.dest('dist'));
});

// css压缩
gulp.task('cssmin', function () {
    return gulp.src(['dist/**/*.css', '!dist/**/*.min.css'], { base: './dist' })
        .pipe(gulpCached('cssmin'))
        .pipe(gulpCssnano())
        .pipe(gulp.dest('dist'));
});

// js 压缩
gulp.task('jsmin', function () {
    return gulp.src(['dist/js/*.js', '!dist/js/**/*.min.js'], { base: './dist' })
        .pipe(gulpCached('jsmin'))
        .pipe(gulpUglify())
        .pipe(gulp.dest('dist'));
});

// html
gulp.task('html', function () {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
});

// image
gulp.task('image', function () {
    return gulp.src('src/img/*.*')
        .pipe(gulp.dest('dist'));
});

// 清空 html、css、js、img
gulp.task('clean', function () {
    return gulp.src(['./dist'], {
        read: false
    })
        .pipe(gulpClean({
            force: true
        }));
});

// 编译 ES6
gulp.task('compileES6', function () {
    gulp.src('src/js/*.js', { base: './src' })
        .pipe(gulpBabel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'))
});

// 编译 sass - 发布到本文件夹下相应目录
gulp.task('compileSass', function () {
    return gulp.src('src/css/*.scss', { base: './src' })
        .pipe(gulpCached('gulpSass'))
        .pipe(gulpSass({ outputStyle: 'expanded' }).on('error', gulpSass.logError))
        .pipe(gulpAutoprefixer('last 6 version'))
        .pipe(gulpPostcss([px2rem({
            baseDpr: 1,             // base device pixel ratio (default: 2)
            threeVersion: false,    // whether to generate @1x, @2x and @3x version (default: false)
            remVersion: true,       // whether to generate rem version (default: true)
            remUnit: 36,            // rem unit value (default: 75)| px转rem的基数
            remPrecision: 12        // rem precision (default: 6)
        })]))
        .pipe(gulp.dest('dist'))
});

// 复制文件
gulp.task('copyFile', ['compileSass', 'compileES6'], function () {
    return gulp.src(['src/css/**/*.css', 'src/js/lib/**/*.js', 'src/*.html', 'src/img/**/*', 'src/fonts/**/*'], { base: './src' })
        .pipe(gulpCached('copyFile'))
        .pipe(gulp.dest('dist'))
});

// 压缩css、js、图片
gulp.task('compress', ['copyFile'], function () {
    gulp.start('cssmin', 'jsmin', 'imagemin');
});

/* dev & publish task */

// 浏览器刷新
gulp.task('default', ['clean'], function () {
    gulp.start('copyFile');
    browserSync.init({
        // 指定服务器启动根目录
        server: './dist'
    });
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/img/*.*', ['image']);
    gulp.watch('src/css/*.scss', ['compileSass']);
    gulp.watch('src/js/*.js', ['compileES6']);
    gulp.watch('./src/**/*.*').on('change', browserSync.reload);
});

// 正式发布
gulp.task('dist', ['clean'], function () {
    gulp.start('compress');
});