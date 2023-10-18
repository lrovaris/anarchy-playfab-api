import { Controller, Get, Post, HttpCode, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { CryptoService } from './crypto.service'

@ApiTags('Crypto')
@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get('transactions')
  @ApiOperation({ summary: 'List transactions for a specific address' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved transactions.'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.'
  })
  async getTransactions() {
    return await this.cryptoService.listTransactions()
  }

  @Post('update-deposits')
  @ApiOperation({ summary: 'Update player deposits based on transactions' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        address: { type: 'string' }
      },
      required: ['address']
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated player deposits.',
    type: String
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to update player deposits.',
    type: String
  })
  async updatePlayerDeposits(
    @Body('address') address: string
  ): Promise<{ message: string }> {
    try {
      if (!address) {
        throw new Error('Address is required.')
      }
      await this.cryptoService.updatePlayerDepositsFromTransactions(address)
      return { message: 'Successfully updated player deposits.' }
    } catch (error) {
      throw new Error(`Failed to update player deposits: ${error.message}`)
    }
  }
}
