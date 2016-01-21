var harpyCss = require('harpy-css');
var through = require('through2');
var gutil = require('gulp-util');
var vm = require('vm');

module.exports = function(options) {
	options = options || {};
	return through.obj(function(file, encoding, callback) {
		if(file.isNull()) {
			// nothing to do
			return callback(null, file);
		}

		if(file.isStream()) {
			this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
		} else if(file.isBuffer()) {
			var inputContent = file.contents.toString();
			var vmContext = vm.createContext(Object.assign({
				css: harpyCss.create(),
				console: console,
			}, options));
			vm.runInContext(inputContent, vmContext, {
				filename: file.path,
			});
			var outputContent = vmContext.css.stringify();

			file.contents = new Buffer(outputContent);
			file.path = gutil.replaceExtension(file.path, '.css');
			return callback(null, file);
		}
	});
};
