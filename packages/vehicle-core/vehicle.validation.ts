import { z } from 'zod';

export const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  mileage: z.number().nonnegative(),
  fuelType: z.enum(['Petrol', 'Diesel', 'CNG', 'LPG', 'Hybrid', 'Electric']),
  transmission: z.enum(['Automatic', 'Manual']),
  price: z.number().positive(),
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  sellerType: z.enum(['Private', 'Dealer']),
  condition: z.enum(['Used', 'New', 'Reconditioned']),
  description: z.string().optional(),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
