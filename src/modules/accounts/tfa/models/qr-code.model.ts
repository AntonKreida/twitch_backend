import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class QrCodeModel {
  @Field(() => String)
  otpauthUrl: string;

  @Field(() => String)
  secret: string;
}
