import { UserRole } from '@cartrust/shared';
import { redirect } from 'next/navigation';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  buyer: 1,
  seller: 2,
  admin: 3,
};

export function checkRole(userRole: UserRole, requiredRole: UserRole) {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function validateDashboardAccess(userRole: UserRole, currentPathRole: string) {
  // If the path says /admin/dashboard and user is not admin, redirect
  if (currentPathRole !== userRole) {
    redirect(`/${userRole}/dashboard`);
  }
}
