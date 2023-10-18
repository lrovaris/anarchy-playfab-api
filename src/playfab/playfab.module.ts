import { Module } from '@nestjs/common';
import { PlayFabController } from './playfab.controller';
import { PlayFabService } from './playfab.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [PlayFabController],
  providers: [PlayFabService]
})
export class PlayFabModule {}