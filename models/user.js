const bcrypt = require("bcrypt");

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        // add properites here
         email: {
             type:DataTypes.STRING,
             unique:true
         },
         password: DataTypes.STRING,
    });

    User.associate = function(models) {
        // add associations here
        // ex:User.hasMany(models.BlogPost);
    };

    User.beforeCreate(function(user){
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10),null);
    })

    return User;
};