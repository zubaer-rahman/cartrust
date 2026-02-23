import { VehicleRepository } from './vehicle.repository';
import { VehicleInput, vehicleSchema } from './vehicle.validation';

export class VehicleService {
  private repo = new VehicleRepository();

  async createListing(sellerId: string, input: VehicleInput, media: { url: string; type: 'image' | 'video'; isPrimary: boolean }[], status: string = 'DRAFT') {
    const validated = vehicleSchema.parse(input);
    const vehicle = await this.repo.create({ ...validated, status }, sellerId);
    
    if (media.length > 0) {
      await this.repo.addMedia(vehicle.id, media);
    }
    
    return vehicle;
  }

  async getActiveListings() {
    return this.repo.findAll({ isApproved: true });
  }

  async approveListing(id: string) {
    return this.repo.update(id, { isApproved: true });
  }

  async boostListing(id: string, days: number) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);
    return this.repo.update(id, { boostExpiresAt: expiresAt });
  }
}
