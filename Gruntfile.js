/**
 * Created by meathill on 15/4/2.
 */
module.exports = function (grunt) {
  var link_reg = /<link rel="stylesheet" href="(.*)"\s?>/ig
    , TEMP = 'temp/';

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
  grunt.loadNpmTasks('grunt-contrib-compass');

  grunt.registerTask('extract', 'extract css imports', function () {
    grunt.file.recurse('src', function (path, root, sub, filename) {
      var content = grunt.file.read(path)
        , csses = [];
      content.replace(link_reg, function (match, css) {
        if (/^(https?:)?\/\//.test(css)) {
          return match;
        }
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
      content = content.replace(link_reg, function (match, src) {
        if (/^(https?:)?\/\//.test(src)) {
          return match;
        }
        return '<style>' + css + '</style>';
      });
      grunt.file.write(TEMP + filename, content);
    });
  });

  grunt.registerTask('default', [
    'clean',
    'compass',
    'extract',
    'cssmin',
    'replace',
    'htmlmin',
    'clean'
  ]);
};