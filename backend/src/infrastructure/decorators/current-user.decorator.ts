import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

import { PenggunaSesi } from '../guards/auth.guard';

/** Ambil pengguna yang sudah diverifikasi AuthGuard: @CurrentUser() user. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): PenggunaSesi => {
    const req = ctx.switchToHttp().getRequest<Request & { pengguna: PenggunaSesi }>();
    return req.pengguna;
  },
);
