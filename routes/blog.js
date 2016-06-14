var express = require('express'),
	router = express.Router();

router.get('/blog', function (req, res) {
	res.render('blog/index');
});

module.exports = router;
