import { Role } from '../enums/role.enum';

export class SignupDto {
  email: string;
  passwordHash: string;
  role: Role;
  name: string;
}