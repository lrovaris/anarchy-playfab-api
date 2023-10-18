import { Module } from '@nestjs/common'
import { CryptoController } from './crypto.controller'
import { CryptoService } from './crypto.service'
import { PlayFabModule } from 'src/playfab/playfab.module'
import { PlayFabService } from 'src/playfab/playfab.service'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [PlayFabModule, UserModule],
  controllers: [CryptoController],
  providers: [CryptoService, PlayFabService]
})
export class CryptoModule {}
