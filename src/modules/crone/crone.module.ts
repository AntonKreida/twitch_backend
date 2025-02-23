import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailModule } from '@/modules/notification';

import { CroneService } from './crone.service';

@Module({
  imports: [ScheduleModule.forRoot(), EmailModule],
  providers: [CroneService],
})
export class CroneModule {}
