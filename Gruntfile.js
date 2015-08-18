module.exports = function(grunt){


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
            },
            release: {
                files: {
                    'dist/js/danmuplayer.min.js': ['src/js/jquery.danmu.js', 'src/js/colpick.js','src/js/sco.tooltip.js','src/js/main.js']
                }
            }
        },
        concat: {
            options: {
            },
            dist: {
                src: ['src/css/scojs.css', 'src/css/colpick.css', 'src/css/bootstrap.css','src/css/main.css'],
                dest: 'dist/css/danmuplayer.css'
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');


    grunt.registerTask('default', ['uglify:release','concat']);

};

