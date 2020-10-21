module.exports = function(sequelize, DataTypes) {
    var Turtle = sequelize.define('Turtle', {
       name: {
           type:DataTypes.STRING,
       },
       isTeenageMutantNinja:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
       },
       age:DataTypes.INTEGER
    });

    Turtle.associate = function(models) {
        // add associations here
       Turtle.belongsTo(models.User,{
        foreignKey:{
            allowNull:false
        }
    });
    };

    return Turtle;
};