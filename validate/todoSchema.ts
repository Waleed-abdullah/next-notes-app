import { JSONSchemaType } from 'ajv';
import { Todo } from '@/utils/types';

const todoSchema: JSONSchemaType<Todo> = {
  type: 'object',
  properties: {
    _id: { type: 'string', nullable: true },
    item: { type: 'string' },
    completed: { type: 'boolean' },
    shared: { type: 'boolean' },
    belongsTo: { type: 'string' },
  },
  required: ['item', 'completed', 'shared', 'belongsTo'],
  additionalProperties: true,
};

export default todoSchema;
