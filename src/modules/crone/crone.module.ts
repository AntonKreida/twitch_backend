import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CroneService } from './crone.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CroneService],
})
export class CroneModule {}
