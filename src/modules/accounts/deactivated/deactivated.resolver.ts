import { Resolver } from '@nestjs/graphql';
import { DeactivatedService } from './deactivated.service';

@Resolver()
export class DeactivatedResolver {
  constructor(private readonly deactivatedService: DeactivatedService) {}
}
