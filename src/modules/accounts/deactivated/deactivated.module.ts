import { Module } from '@nestjs/common';
import { DeactivatedService } from './deactivated.service';
import { DeactivatedResolver } from './deactivated.resolver';

@Module({
  providers: [DeactivatedResolver, DeactivatedService],
})
export class DeactivatedModule {}
