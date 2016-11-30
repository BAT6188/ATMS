_ = require 'underscore'

pattern = /\/\/(.*)\:(\d+)(\/.*)/

#读 proxy 配置
readProxy = (config) ->
  _.map config, (val, key) ->
    r = val.match pattern
    rw = {}
    rw[key] = r[3]||""
    
    context: key
    host: r[1]
    port: r[2]
    rewrite: rw

module.exports = (grunt) ->
  grunt.initConfig 
    pkg: grunt.file.readJSON('package.json')

    watch:
      jade:
        files: 'src/**/*.jade'
        tasks: ['jade:compile']
      livereload:
        options:
          livereload: true
        files: ['app/**/*', 'index.html', 'config/**/*', 'data/**/*']

    jade:
      compile:
        options:
          pretty: true
        cwd: 'src/'
        expand: true
        ext: '.html'
        src: '**/*.jade'
        dest: 'app/'

    clean:
      build: ['build', 'dest']
    
    jshint:
      options:
        jshintrc: true
        # reporter: require 'jshint-stylish'
        reporter: 'test/jshint-reporter/reporter/reporter'
        reporterOutput: 'test/jshint-reporter/index1.html'
      all: 'app/**/*.js'

    connect:
      options:
        port: 8000
        base: '../'
        logger: 'dev'
        hostname: '*'
        livereload: 35729
        open:
          target: 'http://localhost:8000/atms/'
          callback: ->
            console.log 'brower opened..'
        middleware: (connect, options) ->
          proxy = require('grunt-connect-proxy/lib/utils').proxyRequest
          [
            proxy
            connect.static options.base
          ]

      proxies: readProxy(grunt.file.readJSON('proxy.json'))

      jshintReporter:
        options: 
          port: 8001
          base: 'test/jshint-reporter'
          open:
            target: 'http://localhost:8001/'
          middleware: (connect, options) ->
            [connect.static options.base]

  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-connect-proxy'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-jade'

  grunt.registerTask 'test', ['jshint', 'connect:jshintReporter:keepalive']
  grunt.registerTask 'default', ['configureProxies', 'connect:proxies', 'watch']
