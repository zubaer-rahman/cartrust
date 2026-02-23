'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleSchema, VehicleInput } from '@cartrust/vehicle-core';
import { createVehicleListing } from '../actions/vehicle';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@cartrust/ui';
import { Loader2 } from 'lucide-react';

export function VehicleForm({ sellerId }: { sellerId: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const { register, handleSubmit, formState: { errors } } = useForm<VehicleInput>({
    resolver: zodResolver(vehicleSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMediaFiles(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: VehicleInput) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    
    mediaFiles.forEach(file => {
      formData.append('media', file);
    });

    const result = await createVehicleListing(sellerId, formData);
    setIsSubmitting(false);

    if (result.success) {
      router.push('/seller/dashboard');
    } else {
      alert('Error: ' + result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto p-10 bg-card border rounded-[2rem] shadow-2xl">
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tight">Create New Listing</h2>
        <p className="text-muted-foreground font-medium">Fill in the details below to list your vehicle on CarTrust.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold ml-1 uppercase tracking-wider text-muted-foreground">Make</label>
          <Input {...register('make')} placeholder="e.g. Toyota" className="px-5 py-4 rounded-2xl h-auto font-medium" />
          {errors.make && <p className="text-destructive text-xs font-bold mt-1 ml-1">{errors.make.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold ml-1 uppercase tracking-wider text-muted-foreground">Model</label>
          <Input {...register('model')} placeholder="e.g. Corolla" className="px-5 py-4 rounded-2xl h-auto font-medium" />
          {errors.model && <p className="text-destructive text-xs font-bold mt-1 ml-1">{errors.model.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold ml-1 uppercase tracking-wider text-muted-foreground">Year</label>
          <input type="number" {...register('year', { valueAsNumber: true, required: 'Year is required' })} className="w-full px-4 py-3 rounded-xl border bg-background outline-none font-medium" />
          {errors.year && <p className="text-destructive text-xs font-bold mt-1 ml-1">{errors.year.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold ml-1 uppercase tracking-wider text-muted-foreground">Mileage (KM)</label>
          <input type="number" {...register('mileage', { valueAsNumber: true, required: 'Mileage is required' })} className="w-full px-4 py-3 rounded-xl border bg-background outline-none font-medium" />
          {errors.mileage && <p className="text-destructive text-xs font-bold mt-1 ml-1">{errors.mileage.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold ml-1 uppercase tracking-wider text-muted-foreground">Price (BDT)</label>
          <input type="number" {...register('price', { valueAsNumber: true, required: 'Price is required' })} className="w-full px-4 py-3 rounded-xl border bg-background outline-none font-medium" />
          {errors.price && <p className="text-destructive text-xs font-bold mt-1 ml-1">{errors.price.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold ml-1 uppercase tracking-wider text-muted-foreground">Fuel Type</label>
          <select {...register('fuelType')} className="w-full px-4 py-3 rounded-xl border bg-background outline-none font-medium">
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="CNG">CNG</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Electric</option>
          </select>
          {errors.fuelType && <p className="text-destructive text-xs font-bold mt-1 ml-1">{errors.fuelType.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold ml-1 uppercase tracking-wider text-muted-foreground">Transmission</label>
          <select {...register('transmission')} className="w-full px-4 py-3 rounded-xl border bg-background outline-none font-medium">
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
          {errors.transmission && <p className="text-destructive text-xs font-bold mt-1 ml-1">{errors.transmission.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold ml-1 uppercase tracking-wider text-muted-foreground">Division</label>
          <input {...register('division')} placeholder="e.g. Dhaka" className="w-full px-4 py-3 rounded-xl border bg-background outline-none font-medium" />
          {errors.division && <p className="text-destructive text-xs font-bold mt-1 ml-1">{errors.division.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold ml-1 uppercase tracking-wider text-muted-foreground">District</label>
          <input {...register('district')} placeholder="e.g. Gazipur" className="w-full px-4 py-3 rounded-xl border bg-background outline-none font-medium" />
          {errors.district && <p className="text-destructive text-xs font-bold mt-1 ml-1">{errors.district.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold ml-1 uppercase tracking-wider text-muted-foreground">Condition</label>
          <select {...register('condition')} className="w-full px-4 py-3 rounded-xl border bg-background outline-none font-medium">
            <option value="">Select Condition</option>
            <option value="Used">Used</option>
            <option value="New">New</option>
            <option value="Reconditioned">Reconditioned</option>
          </select>
          {errors.condition && <p className="text-destructive text-xs font-bold mt-1 ml-1">{errors.condition.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold ml-1 uppercase tracking-wider text-muted-foreground">Seller Type</label>
          <select {...register('sellerType')} className="w-full px-4 py-3 rounded-xl border bg-background outline-none font-medium">
            <option value="">Select Type</option>
            <option value="Private">Private</option>
            <option value="Dealer">Dealer</option>
          </select>
          {errors.sellerType && <p className="text-destructive text-xs font-bold mt-1 ml-1">{errors.sellerType.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold ml-1 uppercase tracking-wider text-muted-foreground">Photos</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((src, i) => (
            <div key={i} className="aspect-[4/3] bg-muted rounded-2xl relative overflow-hidden group border-2 border-transparent hover:border-primary transition-all">
              <img src={src} className="object-cover w-full h-full" alt="Preview" />
              <button 
                type="button"
                onClick={() => removeFile(i)}
                className="absolute top-2 right-2 bg-black/50 text-white h-8 w-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
          <label className="aspect-[4/3] bg-muted rounded-2xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-all">
            <span className="text-2xl">+</span>
            <span className="text-[10px] font-black uppercase tracking-widest mt-1">Add Photo</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold ml-1 uppercase tracking-wider text-muted-foreground">Description</label>
        <textarea {...register('description')} rows={4} className="w-full px-4 py-3 rounded-xl border bg-background outline-none font-medium" placeholder="Describe your vehicle's condition, features, and history..." />
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        size="lg"
        className="w-full py-8 rounded-2xl font-black text-xl hover:scale-[1.01] shadow-xl"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating Listing...
          </span>
        ) : 'Create Premium Listing'}
      </Button>
    </form>
  );
}
