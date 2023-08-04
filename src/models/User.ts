// models/User.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { tableName } from '../db';

interface UserAttributes {
	id: number;
	username: string;
	email: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
	public id!: number;
	public username!: string;
	public email!: string;
}


export default User;