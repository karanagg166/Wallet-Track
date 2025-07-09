'use client';

import { useRouter } from 'next/navigation';

export function useLogout() {
  const router = useRouter();

  const logout = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Logout failed');
      }

      router.push('/auth/login');
    } catch (err) {
      console.error('Logout error:', err);
      alert('Error logging out. Please try again.');
    }
  };

  return logout;
}
