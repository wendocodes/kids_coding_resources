"use strict";
import { Sequelize, DataTypes } from "sequelize";
import { dirname } from "path";
import { fileURLToPath } from "url";

let storePath = dirname(fileURLToPath(import.meta.url)) + "./../db.sqlite";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: storePath
});

// Model definition
let Resource = sequelize.define("Resource", {
    title: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    category: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    link: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    description: {
        allowNull: false,
        type: DataTypes.TEXT,
    },
}, {
    timestamps: true,
});

export { sequelize, Resource };

