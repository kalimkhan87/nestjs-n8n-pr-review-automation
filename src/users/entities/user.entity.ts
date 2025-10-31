export class User {
  id: number;
  name: string;
  email: string;
  age: number;
  password: string; // Bad: Password should be hashed
  createdAt: Date;
  updatedAt: Date;
}
