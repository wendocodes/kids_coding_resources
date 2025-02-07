"use strict";
import { Sequelize, DataTypes } from "sequelize";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

let storePath = resolve(dirname(fileURLToPath(import.meta.url)), "../db.sqlite");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: storePath
});

// Define User model
let User = sequelize.define("user", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure usernames are unique
        validate: {
            notEmpty: true, // Ensure the username is not empty
            len: [3, 50] // Username length validation (optional)
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true, // Ensure the password is not empty
            len: [8, 100] // You can adjust the length requirement (optional)
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user", // Default role is user, can be changed to admin
        validate: {
            isIn: [["admin", "user"]], // Allow only admin or user roles
        }
    }
}, {
    hooks: {
        // Hash password before saving (creating a user)
        beforeCreate: async (user) => {
            user.password = await bcrypt.hash(user.password, 10); // Hash password
        },
        // Hash password before updating if changed
        beforeUpdate: async (user) => {
            if (user.changed("password")) {
                user.password = await bcrypt.hash(user.password, 10); // Hash updated password
            }
        }
    }
});

// Define Resource model (unchanged)
let Resource = sequelize.define("Resource", {
    title: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
            len: [3, 100]
        }
    },
    category: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    link: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
            isUrl: true
        }
    },
    description: {
        allowNull: false,
        type: DataTypes.TEXT,
    },
}, {
    timestamps: true,
});

export { sequelize, Resource, User };
