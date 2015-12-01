//Definición del modelo de Respuesta

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Respuesta',
	{
		valor: {
			type: DataTypes.STRING
		}
	});
}