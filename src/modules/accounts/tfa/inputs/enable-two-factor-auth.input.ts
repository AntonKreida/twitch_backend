import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class EnableTwoFactorAuthInput {
  @Field()
  @IsString({ message: 'pincode должно быть строкой' })
  @IsNotEmpty({ message: 'pincode не может быть пустым' })
  @MinLength(6, { message: 'pincode должен быть не менее 6-х символов' })
  pincode: string;
}
