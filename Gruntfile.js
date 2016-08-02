/**
 * Created by meathill on 15/4/2.
 */
module.exports = function (grunt) {
  var TEMP = 'temp/';

  grunt.initConfig({
    clean: {
      build: TEMP
    },
    compass: {
      dist: {
        options: {
          config: 'config.rb',
          outputStyle: 'compressed',
          sourcemap: false
        }
      }
    },
    htmlmin: {
      target: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeRedundantAttributes: true,
          removeEmptyAttributes: true
        },
        files: [{
          expand: true,
          cwd: TEMP,
          src: ['*.html'],
          dest: '',
          ext: '.html'
        }]
      }
    },
    inlinecss: {
      main: {
        options: {},
        files: [{
          expand: true,
          cwd: 'src',
          src: ['*.html'],
          dest: TEMP,
          ext: '.html'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-inline-css');

  grunt.registerTask('default', [
    'clean',
    'compass',
    'inlinecss',
    'htmlmin',
    'clean'
  ]);
};