export * from './vehicle.validation';
import { Vehicle, VehicleMedia, User } from '@cartrust/db';

export type VehicleWithMedia = Vehicle & {
  media: VehicleMedia[];
  seller?: User;
};
