'use server';

import { createSafeActionClient } from 'next-safe-action';
import { auth } from '@/lib/auth';

export const action = createSafeActionClient();

export const authenticatedAction = createSafeActionClient({
  middleware: async () => {
    const session = await auth();
    if (!session?.user) {
      throw new Error('UNAUTHORIZED');
    }
    // Devolvemos algo útil al action (p.ej. userId/email)
    return { userId: (session.user as any).id ?? session.user.email };
  },
  handleServerError: (e) => {
    console.error('[safe-action] server error:', e);
    return 'Server error';
  },
});
