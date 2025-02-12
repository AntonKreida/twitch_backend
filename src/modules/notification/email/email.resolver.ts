import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { EmailService } from './email.service';

@Resolver()
export class EmailResolver {
  constructor(private readonly emailService: EmailService) {}

  @Mutation(() => Boolean, { name: 'sendEmail' })
  async sendEmail(@Args('text') text: string) {
    await this.emailService.sendEmail(text);

    return true;
  }
}
