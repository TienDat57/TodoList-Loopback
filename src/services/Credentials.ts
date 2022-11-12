import { UserProfile } from '@loopback/security';
import { EUserRole } from '../enums';

export type Credentials = {
  email: string;
  password: string;
};

export interface MyUserProfile extends UserProfile {
  id: string;
  email: string;
  role?: EUserRole;
}