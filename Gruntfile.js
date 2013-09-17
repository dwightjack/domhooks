
/*jshint node:true */

module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // Project configuration.
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") + "\\n" %>' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */<%= "\\n" %>'
    },

    clean: {
      dist: ['dist']
    },

    concat: {
      options: {
        stripBanners: true,
        banner: '<%= meta.banner %>'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.js' : 'src/<%= pkg.name %>.js'
        }
      }
    },

    uglify: {
      options: {
        preserveComments: 'some'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': 'dist/<%= pkg.name %>.js'
        }
      }
    },

    qunit: {
      files: ['test/**/*.html']
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
    },

    watch: {
      files: '<%= jshint.files %>',
      tasks: 'jshint qunit'
    },

  });

  [
    'grunt-contrib-qunit',
    'grunt-contrib-concat',
    'grunt-contrib-uglify',
    'grunt-contrib-jshint',
    'grunt-contrib-watch',
    'grunt-contrib-clean'
  ].forEach(grunt.loadNpmTasks);

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

};
