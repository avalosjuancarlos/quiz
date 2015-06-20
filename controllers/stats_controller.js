var models = require('../models/models.js');

this.stats = {};
var that = this;

function index (req, res){
	that.req = req;
	that.res = res;
	models.Quiz.count().success(quizCount);
}

function quizCount(count){
	// número de preguntas
	that.stats.quizCount = count;
	
	models.Comment.count().success(commentCount);
}


function commentCount(count){
	// número de comentarios totales
	that.stats.commentCount = count;
	
	// número medio de comentarios por pregunta
	that.stats.commentProm = that.stats.quizCount && count ? Number(count /that.stats.quizCount) : 0;
	
	models.Quiz.count({
		distinct: true,
		include: [{model: models.Comment, required: true}]
		}).success(quizWithComments);
}

function quizWithComments(count){
	// número de preguntas con comentarios
	that.stats.quizWithComments = count;

	// número de preguntas sin comentarios
	that.stats.quizWithoutComments = that.stats.quizCount - count;
	
	that.res.render('stats/index.ejs', {stats: that.stats, errors: []});
}

exports.index = index;
