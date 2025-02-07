import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards';

export const Auth = () => applyDecorators(UseGuards(AuthGuard));
