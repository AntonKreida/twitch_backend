import { Resolver } from '@nestjs/graphql';
import { TfaService } from './tfa.service';

@Resolver()
export class TfaResolver {
  constructor(private readonly tfaService: TfaService) {}
}
