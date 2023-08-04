import { tableName } from "../db";

export default {
	tableName: tableName,
	columns: [
		{ name: 'id', type: 'integer', primaryKey: true, autoIncrement: true },
		{ name: 'username', type: 'string', unique: true },
		{ name: 'email', type: 'string', unique: true },
	],
};
