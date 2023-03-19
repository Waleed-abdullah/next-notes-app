import Ajv from 'ajv';
import userSchema from './userSchema';
import todoSchema from './todoSchema';

const ajv = new Ajv();

// validate is a type guard for MyData - type is inferred from schema type
export const userValidator = ajv.compile(userSchema);
export const todoValidator = ajv.compile(todoSchema);
