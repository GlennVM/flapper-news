var express = require('express');
var router = express.Router();
var testFolder = './test';

gulp.task('runTests', function () {
	return gulp.src(testFolder + '*.js')
		.pipe(plugins.mocha());
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
