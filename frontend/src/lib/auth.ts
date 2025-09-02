import bcrypt from 'bcryptjs';
import { AuditEventType } from '@prisma/client';
import prisma from './prisma';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 30;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createAuditLog(
  eventType: AuditEventType,
  userId: string | null,
  success: boolean,
  detail?: string,
  ip?: string,
  userAgent?: string,
  metadata?: any
) {
  try {
    await prisma.auditLog.create({
      data: {
        eventType,
        userId,
        success,
        eventDetail: detail,
        ip,
        userAgent,
        metadata,
        errorMessage: !success ? detail : undefined,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}

export async function checkAccountLock(email: string): Promise<{ isLocked: boolean; user: any }> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { isLocked: false, user: null };
  }

  // Check if account is locked
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return { isLocked: true, user };
  }

  // Reset lock if expired
  if (user.lockedUntil && user.lockedUntil <= new Date()) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lockedUntil: null,
        loginAttempts: 0,
      },
    });
    user.lockedUntil = null;
    user.loginAttempts = 0;
  }

  return { isLocked: false, user };
}

export async function handleFailedLogin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return false;

  const loginAttempts = user.loginAttempts + 1;
  const shouldLock = loginAttempts >= MAX_LOGIN_ATTEMPTS;

  await prisma.user.update({
    where: { id: userId },
    data: {
      loginAttempts,
      lockedUntil: shouldLock
        ? new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000)
        : undefined,
    },
  });

  if (shouldLock) {
    await createAuditLog(
      AuditEventType.ACCOUNT_LOCKED,
      userId,
      true,
      `Account locked after ${MAX_LOGIN_ATTEMPTS} failed login attempts`
    );
  }

  return shouldLock;
}

export async function handleSuccessfulLogin(
  userId: string,
  ip?: string
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      loginAttempts: 0,
      lockedUntil: null,
      lastLogin: new Date(),
      lastLoginIp: ip,
    },
  });
}

export function generateSecureToken(): string {
  const array = new Uint8Array(32);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // Server-side
    const crypto = require('crypto');
    crypto.randomFillSync(array);
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}