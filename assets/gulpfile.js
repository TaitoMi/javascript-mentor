var __gulp         = require("gulp");
var __autoprefixer = require("autoprefixer");
var __rename       = require("gulp-rename");
var __sass         = require("gulp-sass");
var __debug        = require("gulp-debug");
var __jsMinify     = require("gulp-uglify");
var __colors       = require("colors");
var __cssMinify    = require("gulp-cssmin");
var __babel        = require("gulp-babel");
var __media        = require("gulp-group-css-media-queries");
var __rigger       = require("gulp-rigger");
var __postcss      = require("gulp-postcss");
var __pie          = require("postcss-pie");
var __fixes        = require("postcss-fixes");
var __vueify = require('gulp-vueify');
var browserify = require('browserify');
var vueify = require('vueify');
var babelify = require('babelify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');


//////////////////////////////////////////////////

const   SCSS_INPUT_DIR            = "scss/"
	  , SCSS_OUTPUT_DIR           = "css/"
	  , SCSS_WATCH_GLOB           = (SCSS_INPUT_DIR + "**/*.scss")
	  , SCSS_HIDEN_FILES_PARENT   = (SCSS_INPUT_DIR + "style.scss")
	  , SCSS_HIDDEN_FILES_REGEXP  = /\\_(.*)\.scss$/
	  , SCSS_HIDDEN_FILES_GLOB    = "!\\_*.scss"
	  , SCSS_HIDDEN_DIR_GLOB      = "!\\_*/**/*.scss"
;

const   JS_INPUT_DIR           = "assets/js/"
	  , JS_WATCH_GLOB          = (JS_INPUT_DIR + "**/*.js")
	  , JS_HIDDEN_FILES_GLOB   = ("!" + JS_INPUT_DIR + "**/*.min.js")
;

const   CSS_INPUT_DIR           = "assets/js/libraries/"
	  , CSS_WATCH_GLOB          = (CSS_INPUT_DIR + "**/*.css")
      , CSS_HIDDEN_FILES_GLOB   = ("!" + CSS_INPUT_DIR + "**/*.min.css")
;

const   SETTINGS_AUTPREFIXER = { browsers : ["Chrome >= 25", "Firefox >= 5", "iOS >= 8", "Opera >= 26", "Explorer >= 8"], cascade : false }
      , SETTINGS_SASS        = {}
	  , SETTINGS_DEBUG_VUE   = { title : "Vue:" }
      , SETTINGS_DEBUG_SCSS  = { title : "Completed: " }
	  , SETTINGS_DEBUG_JS    = { title : "Compressed: " }
	  , SETTINGS_DEBUG_CSS   = { title : "Compressed: " }
	  , SETTINGS_ERR_JS   = "JS_ERR"
	  , SETTINGS_ERR_CSS  = "CSS_ERR"
	  , SETTINGS_ERR_SCSS = "SCSS_ERR"
	  , SETTINGS_ERR_VUE = "VUE_ERR"
;

const VUE_WATCH_GLOB = "vue/**/*.vue"
      , VUE_INPUT_FILE = "vue/Main.js"
      , VUE_OUTPUT_FILE = "vue/build"
;

///////////////////////////////////////////////////

function createErrorFunc(prefix){
	return function(error){
		console.log(
			(
				"------"      +
				"\n"          +
				prefix        +
				": "          +
				error.message +
				"\n"          +
				"------"
			).red
		);
		this.end();
	}
}

function getDirPath(path){

	return path.slice(0, path.lastIndexOf("\\"));

}

function compileScss(path, out, func){

	var input  = __gulp.src(path),
		output = __gulp.dest(out)
	;

	var
		option_sass       = __sass(SETTINGS_SASS),
		option_autoprefix = __autoprefixer(SETTINGS_AUTPREFIXER),
		option_pie        = __pie,
		option_fixes      = __fixes,
		option_rename     = __rename(
			func instanceof Function ? function(){ func.apply(path, arguments); } : {}
		),
		option_debug   = __debug(SETTINGS_DEBUG_SCSS),
		option_errno   = createErrorFunc(SETTINGS_ERR_SCSS),
	    option_media   = __media(),
	    option_minify  = __cssMinify(),
	    option_postcss = __postcss([option_pie, option_fixes, option_autoprefix])
	;

	return input
		.pipe(option_sass)
		.on("error", option_errno)
		.pipe(option_media)
		.pipe(option_postcss)
		.pipe(option_minify)
		.pipe(option_debug)
		.pipe(option_rename)
		.pipe(output)
	;


}

function compileJs(path, out, func){

	var input  = __gulp.src(path),
		output = __gulp.dest(out)
	;

	var 
		option_minific = __jsMinify(),
		option_rename  = __rename(
			func instanceof Function ? function(){ func.apply(path, arguments); } : {}
		),
		option_debug   = __debug(SETTINGS_DEBUG_JS),
		option_errno   = createErrorFunc(SETTINGS_ERR_JS),
		option_rigger  = __rigger(),
	    option_babel   = __babel(
		    {
		        presets: ['es2015']
		    }
	    )
	;

	//.pipe(option_babel)

	return input
		.pipe(option_rigger)
		.on("error", option_errno)
		.pipe(option_minific)
		.on("error", option_errno)
		.pipe(option_debug)
		.pipe(option_rename)
		.pipe(output)
	;


}

function compileCss(path, out, func){

	var input  = __gulp.src(path),
	    output = __gulp.dest(out)
	;

	var
		option_minific = __cssMinify(),
		option_rename  = __rename(
			func instanceof Function ? function(){ func.apply(path, arguments); } : {}
		),
		option_debug      = __debug(SETTINGS_DEBUG_CSS),
		option_autoprefix = __autoprefixer(SETTINGS_AUTPREFIXER),
		option_errno      = createErrorFunc(SETTINGS_ERR_CSS),
		option_pie        = __pie,
		option_fixes      = __fixes,
		option_media   = __media(),
		option_postcss = __postcss([option_pie, option_fixes, option_autoprefix])
	;

	return input
		.pipe(option_media)
		.pipe(option_postcss)
		.on("error", option_errno)
		.pipe(option_minific)
		.pipe(option_debug)
		.pipe(option_rename)
		.pipe(output)
	;
}



////////////////////////////////////////////////////

__gulp.task("compileScss", function(){

	return compileScss(
		[SCSS_WATCH_GLOB, SCSS_HIDDEN_FILES_GLOB, SCSS_HIDDEN_DIR_GLOB],
		SCSS_OUTPUT_DIR,
		function(path){
			path.dirname = "";
		}
	);

});

__gulp.task("compileLibraries", function(){

	compileJs(
		[JS_WATCH_GLOB, JS_HIDDEN_FILES_GLOB],
		JS_INPUT_DIR,
		function(path){
			path.extname = ".min.js";
		}
	);

	compileCss(
		[CSS_WATCH_GLOB, CSS_HIDDEN_FILES_GLOB],
		CSS_INPUT_DIR,
		function(path){
			path.extname = ".min.css";
		}
	);

	return true;

});

__gulp.task("watchVue", function(){

	__gulp.watch(VUE_WATCH_GLOB).on('change', function(event){

		compileVue(VUE_INPUT_FILE, VUE_OUTPUT_FILE)

	});

});

// __gulp.task("watchScss", function(){

// 	//For SCSS
// 	__gulp.watch(SCSS_WATCH_GLOB).on("change", function(event){

// 		compileScss(
// 			SCSS_HIDDEN_FILES_REGEXP.test(event.path)
// 				? SCSS_HIDEN_FILES_PARENT
// 				: event.path,
// 			SCSS_OUTPUT_DIR
// 		);

// 	});

// });
__gulp.task("watchScss", function(){

	//For SCSS
	__gulp.watch(SCSS_WATCH_GLOB, {readDelay: 600}).on("change", function(event){

		compileScss(
			SCSS_HIDDEN_FILES_REGEXP.test(event.path)
				? SCSS_HIDEN_FILES_PARENT
				: event.path,
			SCSS_OUTPUT_DIR
		);

	});

});

__gulp.task("watchLibraries", function(){

	//For JS in libraries
	__gulp.watch([JS_WATCH_GLOB, JS_HIDDEN_FILES_GLOB]).on("change", function(event){

		compileJs(
			event.path,
			getDirPath(event.path),
			function(path){
				path.dirname = "";
				path.extname = ".min.js";
			}
		);

	});

	//For CSS in libraries
	__gulp.watch([CSS_WATCH_GLOB, CSS_HIDDEN_FILES_GLOB]).on("change", function(event){

		compileCss(
			event.path,
			getDirPath(event.path),
			function(path){
				path.dirname = "";
				path.extname = ".min.css";
			}
		);

	});

});


__gulp.task("watcher", ["watchLibraries", "watchScss"]);

//////////////////////////////////////////////////////