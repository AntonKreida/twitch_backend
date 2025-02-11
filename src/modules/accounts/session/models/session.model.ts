import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LocationModel {
  @Field(() => String, { nullable: true })
  city: string | null;

  @Field(() => String, { nullable: true })
  country: string | null;

  @Field(() => Number)
  latitude: number;

  @Field(() => Number)
  longitude: number;
}

@ObjectType()
export class DeviceModel {
  @Field(() => String)
  browser: string;

  @Field(() => String)
  os: string;

  @Field(() => String)
  type: string;
}

@ObjectType()
export class MetadataModel {
  @Field(() => LocationModel)
  location: LocationModel;

  @Field(() => DeviceModel)
  device: DeviceModel;

  @Field(() => String)
  ip: string;
}

@ObjectType()
export class SessionModel {
  @Field(() => String)
  id: string;

  @Field(() => String)
  userId: string;

  @Field(() => String)
  createAt: string;

  @Field(() => MetadataModel)
  metadata: MetadataModel;
}
