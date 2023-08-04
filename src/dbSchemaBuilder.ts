import { tableName } from './db';
import fs from 'fs';
import { Schema } from './models/Schema';
import User from './models/User';
import path from 'path';
import { Sequelize, DataTypes, ModelAttributes } from 'sequelize';

function readSchemaFiles(): Schema[] {
  const schemaPath = path.join(__dirname, 'schemas');
  const schemaFiles = fs.readdirSync(schemaPath);
  return schemaFiles.map((file) => require(path.join(schemaPath, file)).default);
}

async function buildDatabaseSchema(): Promise<void> {
  const databaseName = 'dotcardsdb'; // Replace with your desired database name
  const sequelize = new Sequelize({
    dialect: 'postgres',
    database: databaseName,
    username: 'postgres',
    password: 'password',
    port: 5432,
  });
  try {
    await sequelize.authenticate();
    console.log(`Database '${databaseName}' already exists.`);
  } catch (error) {
    const adminConnection = new Sequelize({
      dialect: 'postgres',
      username: 'postgres',
      password: 'password',
      port: 5432,
    });

    try {
      await adminConnection.query(`CREATE DATABASE ${databaseName}`);
      console.log(`Database '${databaseName}' created successfully.`);
    } catch (error) {
      console.error(`Error creating database '${databaseName}': ${error}`);
      return;
    }
  }

  const dataTypes = DataTypes as typeof DataTypes & { [key: string]: any };

  const schemaFiles = readSchemaFiles();

  schemaFiles.forEach((schema) => {
    const { tableName, columns } = schema;
    const modelAttributes: ModelAttributes = {};

    columns.forEach((column) => {
      const dataType = dataTypes[column.type.toUpperCase()];
      if (dataType) {
        modelAttributes[column.name] = {
          type: dataType,
          primaryKey: column.primaryKey || false,
          autoIncrement: column.autoIncrement || false,
          unique: column.unique || false,
        };
      } else {
        throw new Error(`Invalid data type: ${column.type}`);
      }
    });

    sequelize.define(tableName, modelAttributes);
  });

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      tableName: tableName,
      sequelize,
    }
  );

  await sequelize.sync();
}

export default buildDatabaseSchema;
