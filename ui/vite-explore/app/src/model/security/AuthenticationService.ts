import type { UserProfile } from "./UserProfile";
import { MOCK_USERS } from "./UsersDb";

export interface AuthCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
  mfaCode?: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number; // seconds
  expiresAt: string; // ISO date
}

export interface AuthSession {
  sessionId: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface AuthResult {
  success: boolean;
  user?: UserProfile;
  token?: AuthToken;
  session?: AuthSession;
  error?: AuthError;
}

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_SUSPENDED'
  | 'EMAIL_NOT_VERIFIED'
  | 'MFA_REQUIRED'
  | 'MFA_INVALID'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR';

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  details?: Record<string, any>;
}

export interface IAuthenticationService {
  login(credentials: AuthCredentials): Promise<AuthResult>;
  logout(): Promise<void>;
}

export class AuthenticationService implements IAuthenticationService {
  constructor() {
  }

  // ========================================================================
  // Login - Pure authentication logic, returns result
  // ========================================================================
  public async login(credentials: AuthCredentials): Promise<AuthResult> {
    try {
      // Simulate network delay
      await this.delay(800);

      // Find user in mock database
      const mockUser = MOCK_USERS.find((u) => u.username.toLowerCase() === credentials.username.toLowerCase());

      if (!mockUser) {
        return this.createErrorResult(
          'INVALID_CREDENTIALS',
          'Invalid username or password'
        );
      }

      // Verify password
      if (mockUser.password !== credentials.password) {
        return this.createErrorResult(
          'INVALID_CREDENTIALS',
          'Invalid username or password'
        );
      }

      // Check account status
      if (mockUser.profile.metadata.accountStatus !== 'active') {
        return this.createErrorResult(
          'ACCOUNT_SUSPENDED',
          `Account is ${mockUser.profile.metadata.accountStatus}`
        );
      }

      // Check email verification
      if (
        !mockUser.profile.metadata.emailVerified &&
        !mockUser.profile.roles.includes('guest')
      ) {
        return this.createErrorResult(
          'EMAIL_NOT_VERIFIED',
          'Please verify your email address before logging in'
        );
      }

      // Check if MFA is required
      if (mockUser.requiresMFA && !credentials.mfaCode) {
        return {
          success: false,
          error: {
            code: 'MFA_REQUIRED',
            message: 'Multi-factor authentication code required',
            details: { userId: mockUser.profile.id },
          },
        };
      }

      // Verify MFA code if provided
      if (mockUser.requiresMFA && credentials.mfaCode) {
        const mfaValid = await this.verifyMFACode(credentials.mfaCode);
        
        if (!mfaValid) {
          return this.createErrorResult('MFA_INVALID', 'Invalid MFA code');
        }
      }

      // Update last login metadata
      const updatedProfile: UserProfile = {
        ...mockUser.profile,
        metadata: {
          ...mockUser.profile.metadata,
          lastLoginAt: new Date().toISOString(),
          loginCount: mockUser.profile.metadata.loginCount + 1,
        },
      };

      // Generate auth token
      const token = this.generateToken(
        updatedProfile.id,
        credentials.rememberMe
      );

      // Create session
      const session = this.createSession(updatedProfile.id);

      // Return success result - caller handles storage
      return {
        success: true,
        user: updatedProfile,
        token,
        session,
      };
    } catch (error) {
      console.error('Login error:', error);
      return this.createErrorResult(
        'UNKNOWN_ERROR',
        error instanceof Error ? error.message : 'Login failed'
      );
    }
  }

  // ========================================================================
  // Logout - Just cleanup, returns immediately
  // ========================================================================

  public async logout(): Promise<void> {
    try {
      // Simulate API call to invalidate session on server
      await this.delay(200);
      
      // In real app: await fetch('/api/auth/logout', { method: 'POST' });
      
      // No storage to clear here - caller handles that
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // ========================================================================
  // Helper Methods (Private)
  // ========================================================================

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateToken(userId: string, rememberMe?: boolean): AuthToken {
    const expiresIn = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    return {
      accessToken: `access_${crypto.randomUUID()}_${userId}`,
      refreshToken: `refresh_${crypto.randomUUID()}_${userId}`,
      tokenType: 'Bearer',
      expiresIn,
      expiresAt,
    };
  }

  private createSession(userId: string): AuthSession {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    return {
      sessionId: crypto.randomUUID(),
      userId,
      createdAt: new Date().toISOString(),
      expiresAt,
      userAgent: navigator.userAgent,
      ipAddress: '127.0.0.1',
    };
  }

  private createErrorResult(
    code: AuthErrorCode,
    message: string
  ): AuthResult {
    return {
      success: false,
      error: { code, message },
    };
  }

  private async verifyMFACode(code: string): Promise<boolean> {
    // Mock MFA verification
    return code === '123456';
  }
}