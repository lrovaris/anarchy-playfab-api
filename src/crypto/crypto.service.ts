import { Injectable } from '@nestjs/common'
import axios from 'axios'
import * as config from './crypto.config'
import { PlayFabService } from 'src/playfab/playfab.service'
import { UsersService } from 'src/user/users.service'
import * as crypto from 'crypto'

@Injectable()
export class CryptoService {
  private readonly apiUrl = 'https://api-goerli.etherscan.io/api'
  private readonly gameAddress = config.GAME_ADDRESS.toLowerCase() // Addresses in Ethereum are case-insensitive
  private readonly apiKey = config.ETH_API_KEY

  constructor(
    private readonly playFabService: PlayFabService,
    private readonly userService: UsersService
  ) {}

  createHash(data: any): string {
    const hash = crypto.createHash('sha256')
    hash.update(data)
    return hash.digest('hex')
  }

  async listTransactions(): Promise<any> {
    const params = {
      module: 'account',
      action: 'txlist',
      address: this.gameAddress,
      startblock: 0,
      endblock: 99999999,
      page: 1,
      offset: 10,
      sort: 'asc',
      apikey: this.apiKey
    }

    try {
      const response = await axios.get(this.apiUrl, { params })
      return this.filterTransactions(response.data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
      throw new Error('Failed to fetch transactions')
    }
  }

  private filterTransactions(data: any): any {
    if (data.status !== '1' || !Array.isArray(data.result)) {
      throw new Error('Invalid response format')
    }

    const filteredTransactions = data.result.filter(
      (transaction) => transaction.to.toLowerCase() === this.gameAddress
    )

    return filteredTransactions.map((transaction) => ({
      value: transaction.value,
      from: transaction.from,
      timeStamp: transaction.timeStamp
    }))
  }

  async updatePlayerDepositsFromTransactions(address: string): Promise<void> {
    try {
      const user = await this.userService.findOneByAddress(address)
      if (!user) {
        console.error('User not found.')
        return
      }

      const transactions = await this.listTransactions()

      let deposits = user.deposits || []

      const oldDeposits = this.createHash(JSON.stringify(deposits))

      for (const transaction of transactions) {
        if (transaction.from.toLowerCase() == address.toLowerCase()) {
          let deposit = {
            value: transaction.value,
            timeStamp: transaction.timeStamp
          }

          let exists = deposits.find(
            (_deposit) =>
              _deposit.value === deposit.value &&
              _deposit.timeStamp === deposit.timeStamp
          )

          if (!exists) {
            deposits.push(deposit)
          }
        }
      }

      const hashDeposits = this.createHash(JSON.stringify(deposits))

      if (oldDeposits == hashDeposits && deposits.length != 0) return

      await this.playFabService.updatePlayerDeposits(user.name, deposits)
      await this.userService.updateUserDeposits(address, deposits)
    } catch (error) {
      console.error(
        'Failed to update player deposits from transactions:',
        error
      )
    }
  }
}
