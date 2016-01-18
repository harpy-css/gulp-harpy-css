# gulp-harpy-css
Harpy CSS generator for gulp

## How to use

```js
var harpyCss = require('gulp-harpy-css');

gulp.task('harpy-css', function() {
	return gulp.src('src/css-js/**/*.js')
	.pipe(harpyCss())
	.pipe(gulp.dest('dist/css'));
});
```

`css` will be available for you in your source files. It’s a Harpy CSS instance created with `harpyCss.create()`. After your code, `css.stringify()` will be run to retrieve the resulting css.

Example source file:

```js
css.add({
	name: 'mtm',
	property: 'margin-top',
	value: '1rem',
});

css.add({
	name: 'mvm',
}, {
	'marginTop': '1rem',
	'marginBottom': '1rem',
});

css.add({
	name: 'mhm',
}, [
	{
		property: 'margin-right',
		value: '1rem',
	}, {
		property: 'margin-left',
		value: '1rem',
	}
]);
```
