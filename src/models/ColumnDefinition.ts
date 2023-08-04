export interface ColumnDefinition {
	name: string;
	type: string;
	primaryKey?: boolean;
	autoIncrement?: boolean;
	unique?: boolean;
 }