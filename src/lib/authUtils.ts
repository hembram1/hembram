// src/lib/authUtils.ts
'use client';

const ADMIN_AUTH_KEY = 'hembram_admin_auth_status_v1';
const ADMIN_USERNAME = 'hembram1';
const ADMIN_PASSWORD = 'Workshop@12';

export function login(username?: string, password?: string): boolean {
  if (typeof window === 'undefined') return false;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    window.dispatchEvent(new CustomEvent('adminAuthChanged'));
    return true;
  }
  return false;
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_AUTH_KEY);
  window.dispatchEvent(new CustomEvent('adminAuthChanged'));
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
}

export function getAdminContactEmail(): string {
  return 'hembramwork1@gmail.com';
}
