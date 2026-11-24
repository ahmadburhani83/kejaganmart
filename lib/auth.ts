'use client';

export type UserRole = 'pembeli' | 'penjual' | 'admin' | 'superadmin';

export interface UserSession {
  id: string;
  name: string;
  identifier: string; // no WA or username
  role: UserRole;
  roleLabel: string;
  dusun?: string;
  rtRw?: string;
  verificationStatus: 'verified' | 'pending_admin';
  createdAt: string;
}

export const SESSION_STORAGE_KEY = 'kejagan_user_session';
export const USERS_STORAGE_KEY = 'kejagan_registered_users';

export const INITIAL_USERS: UserSession[] = [
  {
    id: 'user-1',
    name: 'Budi Santoso',
    identifier: '81234567890',
    role: 'pembeli',
    roleLabel: 'Pembeli (Warga Desa)',
    dusun: 'Dusun Krajan',
    rtRw: '01/02',
    verificationStatus: 'verified',
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user-2',
    name: 'Warung Bu Slamet',
    identifier: '81298765432',
    role: 'penjual',
    roleLabel: 'Penjual (Toko UMKM Desa)',
    dusun: 'Dusun Kulon',
    rtRw: '03/01',
    verificationStatus: 'verified',
    createdAt: '2026-01-12T09:00:00Z',
  },
  {
    id: 'user-3',
    name: 'Petugas Verifikasi Desa',
    identifier: 'admin',
    role: 'admin',
    roleLabel: 'Admin (Aparatur Desa)',
    dusun: 'Kantor Balai Desa',
    rtRw: '00/00',
    verificationStatus: 'verified',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'user-4',
    name: 'Kepala Desa Kejagan',
    identifier: 'kades',
    role: 'superadmin',
    roleLabel: 'Superadmin (Kepala Desa)',
    dusun: 'Dusun Kejagan',
    rtRw: '01/01',
    verificationStatus: 'verified',
    createdAt: '2026-01-01T00:00:00Z',
  },
];

/**
 * Mendapatkan daftar user tersimpan dari localStorage atau default
 */
export function getRegisteredUsers(): UserSession[] {
  if (typeof window === 'undefined') return INITIAL_USERS;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

/**
 * Menyimpan user baru ke localStorage
 */
export function saveRegisteredUser(newUser: UserSession): void {
  if (typeof window === 'undefined') return;
  const current = getRegisteredUsers();
  const existsIndex = current.findIndex((u) => u.identifier === newUser.identifier);
  let updated: UserSession[];
  if (existsIndex >= 0) {
    updated = [...current];
    updated[existsIndex] = newUser;
  } else {
    updated = [newUser, ...current];
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Deteksi peran otomatis berdasarkan identifier (nomor WA atau username)
 */
export function detectUserRole(identifier: string): {
  role: UserRole;
  roleLabel: string;
  badgeColor: string;
} {
  const clean = identifier.trim().toLowerCase();

  // 1. Cek dari database user terdaftar
  const users = getRegisteredUsers();
  const found = users.find(
    (u) =>
      u.identifier.toLowerCase() === clean ||
      u.identifier.replace(/^0/, '') === clean.replace(/^0/, '').replace(/^\+62/, '')
  );

  if (found) {
    switch (found.role) {
      case 'superadmin':
        return { role: 'superadmin', roleLabel: 'Superadmin (Kepala Desa)', badgeColor: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'admin':
        return { role: 'admin', roleLabel: 'Admin (Aparatur Verifikator Desa)', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'penjual':
        return { role: 'penjual', roleLabel: 'Penjual (Mitra Toko UMKM Desa)', badgeColor: 'bg-blue-100 text-blue-800 border-blue-200' };
      default:
        return { role: 'pembeli', roleLabel: 'Pembeli (Warga Desa)', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    }
  }

  // 2. Deteksi otomatis berdasar kata kunci username
  if (clean.includes('kades') || clean.includes('superadmin') || clean.includes('lurah')) {
    return { role: 'superadmin', roleLabel: 'Superadmin (Kepala Desa)', badgeColor: 'bg-purple-100 text-purple-800 border-purple-200' };
  }

  if (clean.includes('admin') || clean.includes('petugas') || clean.includes('aparatur') || clean.includes('perangkat')) {
    return { role: 'admin', roleLabel: 'Admin (Aparatur Desa)', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' };
  }

  if (clean.includes('toko') || clean.includes('warung') || clean.includes('penjual') || clean.includes('seller')) {
    return { role: 'penjual', roleLabel: 'Penjual (Toko UMKM Desa)', badgeColor: 'bg-blue-100 text-blue-800 border-blue-200' };
  }

  // 3. Jika nomor WA atau warga biasa
  return { role: 'pembeli', roleLabel: 'Pembeli (Warga Desa)', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
}

/**
 * Ambil sesi login aktif saat ini
 */
export function getCurrentSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Simpan sesi login aktif
 */
export function setCurrentSession(session: UserSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

/**
 * Logout
 */
export function clearCurrentSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_STORAGE_KEY);
}
