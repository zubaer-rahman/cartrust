'use server'

import { prisma } from '@cartrust/db';
import { revalidatePath } from 'next/cache';

export async function submitProfileCompletion(userId: string, formData: FormData) {
  try {
    const phoneNumber = formData.get('phoneNumber') as string;
    const nid = formData.get('nid') as string;
    
    if (!phoneNumber || !nid) {
      throw new Error('Phone number and NID are required!');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        phoneNumber,
        nid,
        isProfileComplete: true,
        verificationStatus: 'PENDING'
      }
    });

    revalidatePath('/', 'layout');

    return { success: true, user: updatedUser };
  } catch (error: any) {
    console.error('Profile complete error:', error);
    return { success: false, error: error.message };
  }
}
