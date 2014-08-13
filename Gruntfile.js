module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				files: {
					'application/static/css/simple-style.css': 'application/static/css/newMain.scss'
				}
			}
		},
		cssmin: {
			combine: {
				files: {
					'application/static/css/style.css': ['application/static/css/normalize.min.css', 'application/static/css/simple-style.css']
				}
			}
		},
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass', 'cssmin']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.registerTask('default', ['watch']);
};