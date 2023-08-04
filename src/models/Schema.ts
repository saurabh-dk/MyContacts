import { ColumnDefinition } from "./ColumnDefinition";

export interface Schema {
	tableName: string;
	columns: ColumnDefinition[];
}