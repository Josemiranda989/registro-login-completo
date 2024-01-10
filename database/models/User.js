// const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            /*    set(value) {
                   const hashedPassword = bcrypt.hashSync(value, 10);
                   this.setDataValue('password', hashedPassword);
               } */
        },
        avatar: {
            type: DataTypes.STRING
        },
    });

    User.associate = (models) => {
        User.belongsTo(models.Country, { as: 'country' });
    };

    return User;
};
