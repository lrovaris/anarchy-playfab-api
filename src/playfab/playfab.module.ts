import { Module } from '@nestjs/common'
import { PlayFabController } from './playfab.controller'
import { PlayFabService } from './playfab.service'

@Module({
  controllers: [PlayFabController],
  providers: [PlayFabService]
})
export class PlayFabModule {}
