import { Field, ObjectType } from '@nestjs/graphql';
import { Room } from 'livekit-server-sdk';
import { Codec } from 'livekit-server-sdk/dist/proto/livekit_models';

@ObjectType()
export class CodecModel implements Codec {
  @Field(() => String)
  fmtpLine: string;

  @Field(() => String)
  mime: string;
}

@ObjectType()
export class RoomModel implements Room {
  @Field(() => String)
  sid: string;

  @Field(() => String)
  turnPassword: string;

  @Field(() => Boolean)
  activeRecording: boolean;

  @Field(() => Number)
  creationTime: number;

  @Field(() => Number)
  emptyTimeout: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  metadata: string;

  @Field(() => Number)
  numPublishers: number;

  @Field(() => Number)
  numParticipants: number;

  @Field(() => Number)
  maxParticipants: number;

  @Field(() => [CodecModel])
  enabledCodecs: Codec[];
}
