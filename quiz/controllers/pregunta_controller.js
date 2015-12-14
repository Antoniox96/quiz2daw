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

// GET /preguntas/:preguntaId
exports.show = function(req, res) {
    res.render('preguntas/show', {pregunta: req.pregunta, respuesta: req.respuesta});
};

// GET /preguntas/:id/answer
exports.answer = function(req, res) {

	var resultado = 'Incorrecto';
	if(req.query.respuesta === req.pregunta.respuesta){
		resultado = 'Correcto';
	}
	res.render('preguntas/answer', {respuesta: resultado, pregunta: req.pregunta, cuestionario: req.cuestionario});
};

// GET /preguntas/new
exports.new = function(req, res) {
	var pregunta = models.Pregunta.build( //crea objeto pregunta
		{enunciado: "Pregunta", respuesta: "Respuesta"}
	);
    res.render('preguntas/new', {pregunta: pregunta, cuestionario: req.cuestionario});
};

// POST /preguntas/create
exports.create = function(req, res) {
for(prop in req.body.pregunta) {console.log(prop);}
	var Cuestionario = req.cuestionario;
	var Pregunta = models.Pregunta.build(req.body.pregunta);
	Pregunta.validate()
	.then(
		function(err){
			if(err) {
				res.render('preguntas/new', {pregunta: pregunta, cuestionario: req.cuestionario, errors: err.errors});
			} else {
				models.Pregunta.create({enunciado: req.body.pregunta.enunciado, respuesta: req.body.pregunta.respuesta}).then(function (pregunta) {
					Cuestionario.addPregunta(pregunta);
				}).then(function(){ res.redirect('/admin/cuestionarios/' + req.cuestionario.id + '/preguntas'); })	//Redireccion HTTP (URL relativo) lista de preguntas
			}
		}
	);
};

// GET /preguntas/:id/edit
exports.edit = function(req, res) {
    var pregunta = req.pregunta; //autoload de instancia de pregunta
    res.render('preguntas/edit', {pregunta: pregunta, cuestionario: req.cuestionario});
};

exports.update = function(req, res) {
    req.pregunta.pregunta = req.body.pregunta.enunciado;
    req.pregunta.respuesta = req.body.pregunta.respuesta;
    
    req.pregunta
            .validate()
            .then(
            function(err){
                if(err){
                    res.render('preguntas/edit', {pregunta: req.pregunta, cuestionario: req.cuestionario});
                }else{
                    req.pregunta
                            .save({fields:["enunciado","respuesta"]})
                            .then(function(){res.redirect('/admin/cuestionarios');});
                }
            }
        );
};

exports.destroy = function(req, res) {
    req.pregunta.destroy().then( function(){
        res.redirect('/admin/preguntas');
    }).catch(function(error){next(error)});
};
