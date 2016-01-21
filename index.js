var harpyCss = require('harpy-css');
var through = require('through2');
var gutil = require('gulp-util');
var vm = require('vm');

var formatNumber = function(number, digits) {
	if(digits === undefined) digits = 6;
	var precision = Math.pow(10, digits);
	return Math.round(number * precision) / precision;
};

var PLUGIN_NAME = 'gulp-harpy-css';

module.exports = function(options) {
	options = options || {};
	return through.obj(function(file, encoding, cb) {
		if(file.isNull()) {
			// nothing to do
			return cb(null, file);
		}

		if(file.isStream()) {
			this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
		} else if(file.isBuffer()) {
			var inputContent = file.contents.toString();
			var vmContext;
			var outputContent;
			try {
				console.log('hej');
				vmContext = vm.createContext(Object.assign({
					css: harpyCss.create(),
					console: console,
					formatNumber: formatNumber,
				}, options));
				vm.runInContext(inputContent, vmContext, {
					filename: file.path,
				});
				outputContent = vmContext.css.stringify({
					beautify: true,
				});
			} catch(error) {
				return cb(new gutil.PluginError(PLUGIN_NAME, {
					message: error.name+' while running harpy-css\n'+error.stack,
				}));
			}

			file.contents = new Buffer(outputContent);
			file.path = gutil.replaceExtension(file.path, '.css');
			return cb(null, file);
		}
	});
};
