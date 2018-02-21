module.exports = function(grunt) {

  require("load-grunt-tasks")(grunt);

  const config = {
    src: ["Gruntfile.js", "src/**/*.js"],
    dest: "build/"
  }

  grunt.initConfig({
    jshint: {
      files: config.src,
      options: {
        esversion: 6,   // Suppress warning for ES6 syntax
        asi: true,      // Suppress warnings for missing semicolons
        laxbreak: true, // Suppress warnings for line break
        loopfunc: true  // Suppress warnings for func declaration within loops
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['src/**'],
            dest: 'dest/',
            filter: 'isFile'
          }
        ]
      }
    },
    watch: {
      files: config.src,
      tasks: ["jshint"]
    }
  });

  grunt.registerTask("default", ["jshint"]);
  // grunt.registerTask("copy", ["copy"]);
  // grunt.registerTask("watch", ["jshint", "copy"]);
}
