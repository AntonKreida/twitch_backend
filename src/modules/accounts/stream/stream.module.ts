import { Module } from '@nestjs/common';
import { StreamService } from './stream.service';
import { StreamResolver } from './stream.resolver';
import { StreamRepository } from './repositories';

@Module({
  providers: [StreamResolver, StreamRepository, StreamService],
})
export class StreamModule {}
