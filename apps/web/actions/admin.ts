'use server'

import { prisma } from '@cartrust/db';
import { revalidatePath } from 'next/cache';

export async function updateUserStatus(userId: string, action: 'VERIFY' | 'REJECT' | 'SUSPEND' | 'RESTORE') {
  try {
    const data: any = {};
    if (action === 'VERIFY') data.verificationStatus = 'VERIFIED';
    if (action === 'REJECT') data.verificationStatus = 'REJECTED';
    if (action === 'SUSPEND') data.isSuspended = true;
    if (action === 'RESTORE') data.isSuspended = false;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data
    });

    revalidatePath('/admin/dashboard');

    return { success: true, user: updatedUser };
  } catch (error: any) {
    console.error('Update user status error:', error);
    return { success: false, error: error.message };
  }
}
