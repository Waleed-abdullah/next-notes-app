import { JSONSchemaType } from 'ajv';
import { User } from '@/utils/types';

const userSchema: JSONSchemaType<User> = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    hashedPassword: { type: 'string' },
  },
  required: ['email', 'hashedPassword'],
  additionalProperties: true,
};

export default userSchema;
