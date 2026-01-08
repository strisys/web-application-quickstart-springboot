export type UserRole = 
  | 'admin'
  | 'user'
  | 'moderator'
  | 'guest'
  | 'premium';

export type Permission =
  | 'read'
  | 'write'
  | 'delete'
  | 'admin'
  | 'manage_users'
  | 'view_analytics'
  | 'export_data';

export interface UserPreferences {
   theme: 'light' | 'dark' | 'auto';
   language: string;
   timezone: string;
   notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
   };
   privacy: {
      profileVisible: boolean;
      showEmail: boolean;
      showActivity: boolean;
   };
}

export interface UserMetadata {
  createdAt: string;
  lastLoginAt: string;
  loginCount: number;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  accountStatus: 'active' | 'suspended' | 'pending' | 'deleted';
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  roles: UserRole[];
  permissions: Permission[];
  preferences: UserPreferences;
  metadata: UserMetadata;
}