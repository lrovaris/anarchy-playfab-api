import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PlayFabModule } from './playfab/playfab.module'

@Module({
  imports: [PlayFabModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
