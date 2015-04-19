module.exports = function (grunt) {
  //
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
concat:{
options:{
        separator:';'
      },
      dist:{
        src:['video-js.css','scojs.css', 'colpick.css'],
        dest:'danmuplayer.css'
      }
    },
    uglify:{
      build:{
        src:'danmuplayer.css',
        dest:'danmuplayer.min.css'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
//   默认任务
  grunt.registerTask('default', ['concat', 'uglify']);
}