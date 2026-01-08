import type { UserProfile } from "./UserProfile";

interface MockUser {
  username: string;
  password: string;
  profile: UserProfile;
  requiresMFA?: boolean;
}

export const MOCK_USERS: MockUser[] = [
  {
    username: 'admin',
    password: 'admin123',
    profile: {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      displayName: 'Admin User',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      roles: ['admin', 'user'],
      permissions: ['read', 'write', 'delete', 'admin', 'manage_users', 'view_analytics', 'export_data'],
      preferences: {
        theme: 'dark',
        language: 'en',
        timezone: 'America/New_York',
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        privacy: {
          profileVisible: true,
          showEmail: false,
          showActivity: true,
        },
      },
      metadata: {
        createdAt: '2023-01-15T10:00:00Z',
        lastLoginAt: new Date().toISOString(),
        loginCount: 127,
        emailVerified: true,
        phoneVerified: true,
        twoFactorEnabled: false,
        accountStatus: 'active',
      },
    },
  },
  {
    username: 'user',
    password: 'user123',
    profile: {
      id: '2',
      username: 'user',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
      roles: ['user'],
      permissions: ['read', 'write'],
      preferences: {
        theme: 'light',
        language: 'en',
        timezone: 'America/Los_Angeles',
        notifications: {
          email: true,
          push: false,
          sms: false,
        },
        privacy: {
          profileVisible: true,
          showEmail: true,
          showActivity: false,
        },
      },
      metadata: {
        createdAt: '2023-06-20T14:30:00Z',
        lastLoginAt: new Date().toISOString(),
        loginCount: 45,
        emailVerified: true,
        phoneVerified: false,
        twoFactorEnabled: false,
        accountStatus: 'active',
      },
    },
  },
  {
    username: 'premium',
    password: 'premium123',
    profile: {
      id: '3',
      username: 'premium',
      email: 'premium@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      displayName: 'Jane Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=premium',
      roles: ['premium', 'user'],
      permissions: ['read', 'write', 'export_data'],
      preferences: {
        theme: 'auto',
        language: 'en',
        timezone: 'Europe/London',
        notifications: {
          email: true,
          push: true,
          sms: true,
        },
        privacy: {
          profileVisible: false,
          showEmail: false,
          showActivity: false,
        },
      },
      metadata: {
        createdAt: '2023-03-10T08:15:00Z',
        lastLoginAt: new Date().toISOString(),
        loginCount: 89,
        emailVerified: true,
        phoneVerified: true,
        twoFactorEnabled: true,
        accountStatus: 'active',
      },
    },
    requiresMFA: true,
  },
  {
    username: 'guest',
    password: 'guest123',
    profile: {
      id: '4',
      username: 'guest',
      email: 'guest@example.com',
      firstName: 'Guest',
      lastName: 'User',
      displayName: 'Guest',
      roles: ['guest'],
      permissions: ['read'],
      preferences: {
        theme: 'light',
        language: 'en',
        timezone: 'UTC',
        notifications: {
          email: false,
          push: false,
          sms: false,
        },
        privacy: {
          profileVisible: true,
          showEmail: false,
          showActivity: false,
        },
      },
      metadata: {
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        loginCount: 1,
        emailVerified: false,
        phoneVerified: false,
        twoFactorEnabled: false,
        accountStatus: 'active',
      },
    },
  },
];
