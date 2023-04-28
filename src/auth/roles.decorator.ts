import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (role: string | string[]) => SetMetadata(ROLES_KEY, role);
