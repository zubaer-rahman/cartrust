import { prisma, Vehicle, VehicleMedia } from '@cartrust/db';

export class VehicleRepository {
  async create(data: any, sellerId: string) {
    return prisma.vehicle.create({
      data: {
        ...data,
        sellerId,
      },
    });
  }

  async findById(id: string) {
    return prisma.vehicle.findUnique({
      where: { id },
      include: { media: true, seller: true },
    });
  }

  async findAll(filters: any = {}) {
    return prisma.vehicle.findMany({
      where: {
        status: { in: ['PUBLISHED', 'SOLD'] }, // Include all visible statuses
        isSuspended: false,
        ...filters,
      },
      include: { media: true, seller: true }, // Added seller for details
      orderBy: [
        { boostExpiresAt: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async update(id: string, data: any) {
    return prisma.vehicle.update({
      where: { id },
      data,
    });
  }

  async addMedia(vehicleId: string, media: { url: string; type: string; isPrimary: boolean }[]) {
    return prisma.vehicleMedia.createMany({
      data: media.map(m => ({ ...m, vehicleId })),
    });
  }
}
