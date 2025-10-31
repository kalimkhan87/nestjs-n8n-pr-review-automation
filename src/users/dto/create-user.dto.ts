export class CreateUserDto {
  name: string; // Bad: No validation
  email: string; // Bad: No email format validation
  age: number; // Bad: No min/max validation
  password: string; // Bad: Storing plain password
}
