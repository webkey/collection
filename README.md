to cdm commandline: start
    ============
    //npm i gulp
    //npm i
    //npm i bower
    //bower i
    ============

In modernizr-config.json store custom configuration for modernizr.js
https://modernizr.com/
Build
Command Line Config

Gulp task "scripts"

1) Bower:
cmd:
bower install PACKAGE --save
save configuration to bower.json
.bowerrc - folder save

2) add path to lib:
return gulp.src([
		'src/libs/jquery/dist/jquery.min.js',
		'...',
		'...'
	])

Gulp task "css-libs"
1) add plugin's css to libs.sass with @import
2) check correct path to files