import { Role } from '../../auth/enums/role.enum';

export class User {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  name: string;
}