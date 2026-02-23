'use server'

import { VehicleService } from '@cartrust/vehicle-core';
import { vehicleSchema } from '@cartrust/vehicle-core';
import { MediaService } from '@cartrust/media';
import { prisma } from '@cartrust/db';
import { revalidatePath } from 'next/cache';

const vehicleService = new VehicleService();
const mediaService = new MediaService();

export async function createVehicleListing(sellerId: string, formData: FormData) {
  try {
    const rawData = {
      make: formData.get('make') as string,
      model: formData.get('model') as string,
      year: parseInt(formData.get('year') as string),
      mileage: parseInt(formData.get('mileage') as string),
      fuelType: formData.get('fuelType') as any,
      transmission: formData.get('transmission') as any,
      price: parseFloat(formData.get('price') as string),
      division: formData.get('division') as string,
      district: formData.get('district') as string,
      sellerType: formData.get('sellerType') as any,
      condition: formData.get('condition') as any,
      description: formData.get('description') as string,
    };

    const validatedData = vehicleSchema.parse(rawData);
    
    // Handle Media Uploads
    const files = formData.getAll('media') as File[];
    const mediaUrls = [];

    for (const file of files) {
      if (file.size > 0) {
        const fileName = `${sellerId}/${Date.now()}-${file.name}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        const url = await mediaService.uploadFile(buffer, fileName, file.type);
        mediaUrls.push({
          url,
          type: (file.type.startsWith('video') ? 'video' : 'image') as 'image' | 'video',
          isPrimary: mediaUrls.length === 0 // First one is primary
        });
      }
    }
    
    // Check profile completion to determine post status
    const seller = await prisma.user.findUnique({ where: { id: sellerId } });
    const status = seller?.isProfileComplete ? 'PUBLISHED' : 'DRAFT';
    
    const vehicle = await vehicleService.createListing(sellerId, validatedData, mediaUrls, status);

    revalidatePath('/browse');
    revalidatePath('/seller/dashboard');
    
    return { success: true, vehicle };
  } catch (error: any) {
    console.error('Create listing error:', error);
    return { success: false, error: error.message };
  }
}

export async function publishVehicleListing(vehicleId: string, sellerId: string) {
  try {
    const seller = await prisma.user.findUnique({ where: { id: sellerId } });
    if (!seller || !seller.isProfileComplete) {
      throw new Error('You must complete your profile before publishing listings.');
    }

    const vehicle = await prisma.vehicle.update({
      where: { 
        id: vehicleId,
        sellerId: sellerId // ensure the user actually owns this vehicle
      },
      data: { status: 'PUBLISHED' }
    });

    revalidatePath('/browse');
    revalidatePath('/seller/dashboard');

    return { success: true, vehicle };
  } catch (error: any) {
    console.error('Publish listing error:', error);
    return { success: false, error: error.message };
  }
}
