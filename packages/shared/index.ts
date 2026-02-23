export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  createdAt: Date;
}

export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'LPG' | 'Hybrid' | 'Electric';
export type Transmission = 'Automatic' | 'Manual';
export type SellerType = 'Private' | 'Dealer';
export type Condition = 'Used' | 'New' | 'Reconditioned';

export interface Vehicle {
  id: string;
  sellerId: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: FuelType;
  transmission: Transmission;
  price: number;
  division: string;
  district: string;
  sellerType: SellerType;
  condition: Condition;
  description?: string;
  isApproved: boolean;
  isSuspended: boolean;
  boostExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleMedia {
  id: string;
  vehicleId: string;
  url: string;
  type: 'image' | 'video';
  isPrimary: boolean;
}
