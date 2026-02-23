import { prisma } from '@cartrust/db';

export class PaymentService {
  async createBoostTransaction(userId: string, planId: string, amount: number) {
    return prisma.paymentTransaction.create({
      data: {
        userId,
        amount,
        status: 'PENDING',
        provider: 'bKash',
      },
    });
  }

  async completeBoostTransaction(transactionId: string, vehicleId: string, durationDays: number) {
    const transaction = await prisma.paymentTransaction.update({
      where: { id: transactionId },
      data: { status: 'COMPLETED' },
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { boostExpiresAt: expiresAt },
    });

    return transaction;
  }

  async getBoostedListings() {
    return prisma.vehicle.findMany({
      where: {
        boostExpiresAt: {
          gt: new Date(),
        },
        isApproved: true,
      },
      orderBy: {
        boostExpiresAt: 'desc',
      },
    });
  }
}
