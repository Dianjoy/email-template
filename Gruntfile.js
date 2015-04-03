/**
 * Created by meathill on 15/4/2.
 */
module.exports = function (grunt) {
  var import_reg = /@import url\((.*)\);/mig
    , style_reg = /<style>([\S\s]+)<\/style>/mig
    , TEMP = 'temp/';

  grunt.initConfig({
    clean: {
      build: TEMP
    },
    cssmin: {
      target: {
        options: {
          keepSpecialComments: 0
        },
        files: [{
          expand: true,
          cwd: TEMP,
          src: [ '*.css', '!*.min.css'],
          dest: TEMP,
          ext: '.html.min.css'
        }]
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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  grunt.registerTask('extract', 'extract css imports', function () {
    grunt.file.recurse('src', function (path, root, sub, filename) {
      var content = grunt.file.read(path)
        , csses = [];
      content.replace(import_reg, function (match, css) {
        css = grunt.file.read(css.replace('../', ''));
        csses.push(css);
      });
      grunt.file.write(TEMP + filename + '.css', csses.join('\n'));
    });
  });

  grunt.registerTask('replace', 'replace imports with css', function () {
    grunt.file.recurse('src', function (path, root, sub, filename) {
      var content = grunt.file.read(path)
        , css = grunt.file.read(TEMP + filename + '.min.css');
      content = content.replace(style_reg, '<style>' + css + '</style>');
      grunt.file.write(TEMP + filename, content);
    });
  });

  grunt.registerTask('default', [
    'clean',
    'extract',
    'cssmin',
    'replace',
    'htmlmin',
    'clean'
  ]);
};