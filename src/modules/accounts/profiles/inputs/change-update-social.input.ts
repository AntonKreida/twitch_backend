import { InputType } from '@nestjs/graphql';

@InputType()
export class ChangeUpdateSocialInput {
  id: string;
  title: string;
  url: string;
}
