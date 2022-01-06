const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const uglifycss = require("gulp-uglifycss");
const babel = require("gulp-babel");
const concat = require("gulp-concat");

//compile scss into css
function style() {
    return (
        gulp
            //Locate SCSS files
            .src("./src/scss/**/*.scss")
            //Create sourcemap for SCSS files
            .pipe(sourcemaps.init())
            //Compile with SASS compiler
            .pipe(sass().on("error", sass.logError))
            .pipe(postcss([autoprefixer()]))
            .pipe(uglifycss({ uglyComments: true }))
            .pipe(sourcemaps.write())
            //Save compiled CSS
            .pipe(gulp.dest("./dist/css"))
            //Stream changes to all browsers
            .pipe(browserSync.stream())
    );
}

function copyImages() {
    //Copies images placed in development image folder into production image folder
    return gulp
        .src("./src/images/**/*.{jpg,jpeg,png,gif,svg}")
        .pipe(gulp.dest("./dist/images"));
}

function compileJS() {
    return gulp
        .src("./src/js/**/*.js")
        .pipe(sourcemaps.init())
        .pipe(
            babel({
                presets: ["@babel/env"],
            })
        )
        .pipe(concat("all.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./dist/js"));
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./",
        },
    });
    gulp.watch("./src/scss/**/*.scss", style);
    gulp.watch("./src/js/**/*.js", { ignoreInitial: false }, compileJS);
    gulp.watch("./*.html").on("change", browserSync.reload);
    gulp.watch(
        "./src/images/**/*.{jpg,jpeg,png,gif,svg}",
        { ignoreInitial: false },
        copyImages
    );
    gulp.watch("./src/js/**/*.js").on("change", browserSync.reload);
}

exports.style = style;
exports.watch = watch;
