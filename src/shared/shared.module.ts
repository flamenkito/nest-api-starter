import { Module, Global } from '@nestjs/common';

import { ConfigService } from './config.service';
import { CollectionService } from './collection';

@Global()
@Module({
  providers: [CollectionService, ConfigService],
})
export class SharedModule {}
