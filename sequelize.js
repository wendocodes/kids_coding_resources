import { Sequelize } from "sequelize";

// Initialize Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './data/db.sqlite'
});

export default sequelize;