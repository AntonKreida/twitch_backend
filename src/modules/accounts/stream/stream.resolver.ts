import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StreamService } from './stream.service';
import { StreamModel } from './models';
import {
  ChangeInfoStreamInput,
  ChangePreviewStreamInput,
  SearchStreamInput,
} from './inputs';
import { Auth, Authorized } from '@shared';

@Resolver()
export class StreamResolver {
  constructor(private readonly streamService: StreamService) {}

  @Query(() => [StreamModel], { name: 'findAllStream' })
  async findAll(
    @Args('searchStream') searchStream: SearchStreamInput,
  ): Promise<StreamModel[]> {
    return await this.streamService.findMany(searchStream);
  }

  @Query(() => [StreamModel], { name: 'findRandomStream' })
  async findRandomStream(): Promise<StreamModel[]> {
    return await this.streamService.findRandomStream();
  }

  @Auth()
  @Mutation(() => StreamModel, { name: 'changeInfoStream' })
  async changeInfoStream(
    @Authorized('id') userId: string,
    @Args('changeInfoStreamInput') changeInfoStreamInput: ChangeInfoStreamInput,
  ) {
    return await this.streamService.changeInfoStream(
      userId,
      changeInfoStreamInput,
    );
  }

  @Auth()
  @Mutation(() => StreamModel, { name: 'changePreviewStream' })
  async changePreviewStream(
    @Authorized('id') userId: string,
    @Args('changePreviewStream') { streamPreview }: ChangePreviewStreamInput,
  ) {
    return await this.streamService.changePreviewStream(userId, streamPreview);
  }
}
