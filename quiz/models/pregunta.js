//Definición del modelo de Pregunta

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Pregunta',
	{
		enunciado: {
			type: DataTypes.STRING,
		}
	});
}