var models = require('../models/models.js');
// Autoload - factoriza el código si ruta incluye :preguntaId
exports.load = function(req, res, next, preguntaId) {
	models.Pregunta.find({
            where: { id: Number(preguntaId)},
        }).then(function(pregunta) {
				if(pregunta) {
					req.pregunta = pregunta;
					next();
				} else { next(new Error('No existe preguntaId=' + preguntaId)); }
			}
	).catch(function(error) { next(error);});
};

// GET /preguntas
exports.index = function(req, res) {
	models.Pregunta.findAll().then(
                function(preguntas) {
    res.render('preguntas/index.ejs', {preguntas: preguntas});
});
}

// GET /preguntas/:preguntaId
exports.show = function(req, res) {
    res.render('preguntas/show', {pregunta: req.pregunta});
};

// GET /preguntas/:id/answer
exports.answer = function(req, res) {

	var resultado = 'Incorrecto';
	if(req.query.respuesta === req.pregunta.respuesta){
		resultado = 'Correcto';
	}
	res.render('preguntas/answer', {respuesta: resultado, pregunta: req.pregunta});
        };

// GET /preguntas/new
exports.new = function(req, res) {
	var pregunta = models.pregunta.build( //crea objeto pregunta
	{pregunta: "Pregunta", respuesta: "Respuesta"}
	);
    res.render('preguntas/new', {pregunta: pregunta});
};

// POST /preguntas/create
exports.create = function(req, res) {
	var pregunta = models.pregunta.build( req.body.pregunta );
	
	//guarda en DB los campos pregunta y respuesta de pregunta
	pregunta.validate()
	.then(
		function(err){
			if(err) {
			res.render('preguntas/new', {pregunta: pregunta, errors: err.errors});
			} else {
				pregunta.save({fields: ["pregunta", "respuesta"]}).then(function(){
					res.redirect('/admin/preguntas');
				})	//Redireccion HTTP (URL relativo) lista de preguntas
			}
		}
	);
};

// GET /preguntas/:id/edit
exports.edit = function(req, res) {
    var pregunta = req.pregunta; //autoload de instancia de pregunta
    res.render('preguntas/edit', {pregunta: pregunta});
};

exports.update = function(req, res) {
    req.pregunta.pregunta = req.body.pregunta.pregunta;
    req.pregunta.respuesta = req.body.pregunta.respuesta;
    
    req.pregunta
            .validate()
            .then(
            function(err){
                if(err){
                    res.render('preguntas/edit',{pregunta: req.pregunta});
                }else{
                    req.pregunta
                            .save({fields:["pregunta","respuesta"]})
                            .then(function(){res.redirect('/admin/preguntas');});
                }
            }
        );
};

exports.destroy = function(req, res) {
    req.pregunta.destroy().then( function(){
        res.redirect('/admin/preguntas');
    }).catch(function(error){next(error)});
};
