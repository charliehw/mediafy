module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			dist: {
				src: [
					'src/mediafy.js',
				],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! \n\t<%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n\tAuthor: charliehw\n\tLicense: MIT\n*/\n'
			},
			dist: {
				files: {
					'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},
		jshint: {
			files: ['src/*.js'],
			options: {
				// options here to override JSHint defaults
				globals: {
					jQuery: true,
					console: true,
					module: true,
					document: true,
                    window: true,
                    navigator: true
				}
			}
		},
		qunit: {
			all: ['tests/*.html']
		},
		jsdoc : {
            dist : {
                src: ['src/*.js'], 
                options: {
                    destination: 'doc'
                }
            }
        }
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-jsdoc');

	// Default task(s).
	grunt.registerTask('test', ['jshint', 'qunit']);
	grunt.registerTask('default', ['jshint', 'qunit', 'jsdoc', 'concat', 'uglify']);

};