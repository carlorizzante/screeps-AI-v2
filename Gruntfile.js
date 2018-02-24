module.exports = function(grunt) {

  require("load-grunt-tasks")(grunt);

  const config = {
    src: ["Gruntfile.js", "src/**/*.js"],
    dest: "/Users/carlorizzante/Library/Application Support/Screeps/scripts/127_0_0_1___21025/default"
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
    clean: {
      contents: [config.dest],
      options: {
        force: true
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['src/**'],
            dest: config.dest,
            filter: 'isFile'
          }
        ]
      }
    },
    watch: {
      files: config.src,
      tasks: ["jshint"]
    },
    wait: {
      options: {
        delay: 500
      },
      pause: {
        options: {
          before : function(options) {
            console.log('pausing %dms', options.delay);
          },
          after : function() {
            console.log('pause end');
          }
        }
      }
    }
  });

  grunt.registerTask("default", ["jshint"]);
  grunt.registerTask("update", ["clean", "wait", "copy"]);
}
