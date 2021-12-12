import gulp from "gulp";
import gulpSass from "gulp-sass";
import nodeSass from "node-sass";
import autoprefixer from "gulp-autoprefixer";
import del from "del";
import bro from "gulp-bro";
import babelify from "babelify";

const sass = gulpSass(nodeSass);

const paths = {
    styles: {
        src: "assets/scss/styles.scss",
        dest: "src/static/styles",
        watch: "assets/scss/**/*.scss"
    },
    js:{
        src: "assets/js/main.js",
        dest: "src/static/js",
        watch: "assets/js/**/*.js"
    }
};

export const styles = () => {
    return gulp
    .src(paths.styles.src, {allowEmpty:true})
    .pipe(sass())
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(gulp.dest(paths.styles.dest));
};

const js = () => {
    return gulp
    .src(paths.js.src, {allowEmpty:true})
    .pipe(bro({
        transform: [
            babelify.configure({
                presets: ["@babel/preset-env"]
                //만약 다른 프리셋을 추가하길 원한다면 여기에 추가하면 된다! 
            }),
        ]
    }))
    .pipe(gulp.dest(paths.js.dest));
};

const watchFiles = () => {
    gulp.watch(paths.styles.watch, styles);
    gulp.watch(paths.js.watch, js);
};

const clean = () => del("src/static");

const dev = gulp.series([clean, styles, js, watchFiles]);

export default dev;