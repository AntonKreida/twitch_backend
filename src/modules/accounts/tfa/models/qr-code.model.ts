import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class QrCodeModel {
  @Field(() => String)
  qrCode: string;

  @Field(() => String)
  secret: string;
}
