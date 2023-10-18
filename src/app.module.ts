import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PlayFabModule } from './playfab/playfab.module'
import { CryptoModule } from './crypto/crypto.module'
import { MongooseModule } from '@nestjs/mongoose'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    PlayFabModule,
    UserModule,
    CryptoModule,
    MongooseModule.forRoot(
      'mongodb+srv://anarchy-next-api:FJc1G7FX9PIyvLLd@cluster0.d26f8xh.mongodb.net/'
    )
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
