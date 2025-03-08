import { Args, Query, Resolver } from '@nestjs/graphql';
import { StreamService } from './stream.service';
import { StreamModel } from './models';
import { SearchStreamInput } from './inputs';

@Resolver()
export class StreamResolver {
  constructor(private readonly streamService: StreamService) {}

  @Query(() => [StreamModel], { name: 'findAllStream' })
  async findAll(
    @Args('searchStream') searchStream: SearchStreamInput,
  ): Promise<StreamModel[]> {
    return await this.streamService.findMany(searchStream);
  }
}
