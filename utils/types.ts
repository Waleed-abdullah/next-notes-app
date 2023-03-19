// Interface to defining our object of response functions
export interface ResponseFuncs {
  GET?: Function;
  POST?: Function;
  PUT?: Function;
  DELETE?: Function;
}

// Interface to define our Todo model on the frontend
export interface Todo {
  _id?: string;
  item: string;
  completed: boolean;
  shared: boolean;
  belongsTo: string;
}

export interface User {
  email: string;
  hashedPassword: string;
}
