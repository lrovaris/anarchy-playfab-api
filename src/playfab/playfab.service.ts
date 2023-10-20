import { Injectable } from '@nestjs/common'
import axios from 'axios'
import { UsersService } from 'src/user/users.service'
import * as crypto from 'crypto'

@Injectable()
export class PlayFabService {
  private readonly baseUrl = 'https://FC69B.playfabapi.com'
  private readonly secretKey =
    'Y9KTNA4K9A6DHC9I84HP3XWOKH913A8OMMG58UPXZIOAI3IX7I'

  constructor(private readonly userService: UsersService) {}

  async getAllSegments(): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/Server/GetAllSegments`,
        {},
        {
          headers: {
            'X-SecretKey': this.secretKey
          }
        }
      )
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch all segments: ${error.errorMessage}`)
    }
  }

  async getPlayersInSegment(
    segmentId: string,
    continuationToken?: string
  ): Promise<any> {
    try {
      const requestBody = {
        SegmentId: segmentId,
        ContinuationToken: continuationToken || null
      }

      const response = await axios.post(
        `${this.baseUrl}/Server/GetPlayersInSegment`,
        requestBody,
        {
          headers: {
            'X-SecretKey': this.secretKey
          }
        }
      )
      return response.data
    } catch (error) {
      throw new Error(
        `Failed to fetch players in segment: ${error.errorMessage}`
      )
    }
  }

  createHash(data: any): string {
    const hash = crypto.createHash('sha256')
    hash.update(data)
    return hash.digest('hex')
  }

  async loginWithGoogle(googleToken: string): Promise<any> {
    try {
      const requestBody = {
        TitleId: 'FC69B',
        CreateAccount: true,
        AccessToken: googleToken
      }

      const { data } = await axios.post(
        `${this.baseUrl}/Client/LoginWithGoogleAccount`,
        requestBody,
        {
          headers: {
            'X-SecretKey': this.secretKey
          }
        }
      )
      let response = data

      const playFabId = response.data.PlayFabId

      const userDataResponse = await this.getUserData(playFabId)
      const spriteDataExists =
        userDataResponse.data &&
        userDataResponse.data.Data &&
        userDataResponse.data.Data.spritesData

      const accountInfoResponse = await this.getUserAccountInfo(playFabId)

      console.log('data.data')
      console.log(userDataResponse.data.data)
      console.log('data.data')

      const displayNameExists =
        accountInfoResponse.data.data &&
        accountInfoResponse.data.data.UserInfo &&
        accountInfoResponse.data.data.UserInfo.TitleInfo &&
        accountInfoResponse.data.data.UserInfo.TitleInfo.DisplayName

      if (!spriteDataExists) {
        await this.updateUserData(playFabId, {
          Body: 'Naked'
        })
      }

      if (!displayNameExists) {
        await this.updateDisplayName(
          playFabId,
          this.createHash((Math.random() * 2 ** 10).toFixed()).substring(0, 12)
        )
      }

      return userDataResponse.data.data



    } catch (error) {
      let errorMessage = 'Failed to login with Google: '

      if (error.response && error.response.data) {
        errorMessage += `${error.response.data.error} - ${error.response.data.errorMessage}`
      } else {
        errorMessage += error.errorMessage
      }

      throw new Error(errorMessage)
    }
  }

  async updateUserData(playerId: string, spritesData: object): Promise<any> {
    try {
      const requestBody = {
        PlayFabId: playerId,
        Data: {
          spritesData: JSON.stringify(spritesData),
          chips: 10000
        }
      }

      const response = await axios.post(
        `${this.baseUrl}/Server/UpdateUserData`,
        requestBody,
        {
          headers: {
            'X-SecretKey': this.secretKey
          }
        }
      )
      return response.data
    } catch (error) {
      let errorMessage = 'Failed to update user data: '

      if (error.response && error.response.data) {
        errorMessage += `${error.response.data.error} - ${error.response.data.errorMessage}`
      } else {
        errorMessage += error.errorMessage
      }

      throw new Error(errorMessage)
    }
  }

  async updateDisplayName(
    playFabId: string,
    newDisplayName: string
  ): Promise<any> {
    try {
      const requestBody = {
        PlayFabId: playFabId,
        DisplayName: newDisplayName
      }

      const response = await axios.post(
        `${this.baseUrl}/Admin/UpdateUserTitleDisplayName`,
        requestBody,
        {
          headers: {
            'X-SecretKey': this.secretKey
          }
        }
      )
      return response.data
    } catch (error) {
      console.log(error)
      throw new Error(`Failed to update display name: ${error}`)
    }
  }

  async getUserData(playFabId: string): Promise<any> {
    const requestBody = { PlayFabId: playFabId }
    return await axios.post(`${this.baseUrl}/Server/GetUserData`, requestBody, {
      headers: {
        'X-SecretKey': this.secretKey
      }
    })
  }

  async getUserAccountInfo(playFabId: string): Promise<any> {
    const requestBody = { PlayFabId: playFabId }
    return await axios.post(
      `${this.baseUrl}/Server/GetUserAccountInfo`,
      requestBody,
      {
        headers: {
          'X-SecretKey': this.secretKey
        }
      }
    )
  }

  async updateUserAddress(playFabId: string, newAddress: string): Promise<any> {
    try {
      const existingDataResponse = await axios.post(
        `${this.baseUrl}/Server/GetUserData`,
        {
          PlayFabId: playFabId,
          Keys: ['address']
        },
        {
          headers: {
            'X-SecretKey': this.secretKey
          }
        }
      )

      const existingAddress = existingDataResponse.data.Data?.address?.value

      if (existingAddress) {
        return { message: 'Address already exists, cannot update.' }
      }

      const requestBody = {
        PlayFabId: playFabId,
        Data: {
          address: newAddress
        }
      }

      const response = await axios.post(
        `${this.baseUrl}/Server/UpdateUserData`,
        requestBody,
        {
          headers: {
            'X-SecretKey': this.secretKey
          }
        }
      )

      const createUserDto = {
        name: playFabId,
        address: newAddress
      }

      const existingUser = await this.userService
        .findAll()
        .then((users) => users.find((user) => user.name === playFabId))

      if (existingUser) {
        existingUser.address = newAddress
        await this.userService.create(existingUser)
      } else {
        await this.userService.create(createUserDto)
      }

      return response.data
    } catch (error) {
      let errorMessage = 'Failed to update user address: '

      if (error.response && error.response.data) {
        errorMessage += `${error.response.data.error} - ${error.response.data.errorMessage}`
      } else {
        errorMessage += error.errorMessage
      }

      throw new Error(errorMessage)
    }
  }

  async updatePlayerDeposits(
    playFabId: string,
    deposits: any[]
  ): Promise<void> {
    try {
      let depositsValue = 0

      for (let i = 0; i < deposits.length; i++) {
        depositsValue += parseInt(deposits[i].value)
      }

      //@ts-ignore
      const { data } = await this.getUserData(playFabId)

      const consumedValue = data.data.Data.consumedValue.Value
        ? data.data.Data.consumedValue.Value
        : 0

      let Data = {
        deposits: JSON.stringify(deposits),
        depositsValue: JSON.stringify(depositsValue),
        availableValue: JSON.stringify(depositsValue - consumedValue),
        consumedValue: JSON.stringify(parseInt(consumedValue))
      }

      const requestBody = {
        PlayFabId: playFabId,
        Data
      }

      await axios.post(`${this.baseUrl}/Server/UpdateUserData`, requestBody, {
        headers: {
          'X-SecretKey': this.secretKey
        }
      })
    } catch (error) {
      console.error('Failed to update player deposits:', error)
      throw new Error('Failed to update player deposits')
    }
  }

  async updatePlayerBalance(
    playFabId: string,
    spentValue: number
  ): Promise<void> {
    try {
      //@ts-ignore
      const { data } = await this.getUserData(playFabId)

      const consumedValue = data.data.Data.consumedValue.Value
        ? data.data.Data.consumedValue.Value
        : 0

      const availableValue = data.data.Data.availableValue.Value
        ? data.data.Data.availableValue.Value
        : 0

      if (spentValue > availableValue) {
        throw new Error('insuficient value')
      }

      let Data = {
        availableValue: JSON.stringify(parseInt(availableValue) - spentValue),
        consumedValue: JSON.stringify(parseInt(consumedValue) + spentValue)
      }

      const requestBody = {
        PlayFabId: playFabId,
        Data
      }

      await axios.post(`${this.baseUrl}/Server/UpdateUserData`, requestBody, {
        headers: {
          'X-SecretKey': this.secretKey
        }
      })
    } catch (error) {
      console.error('Failed to update player deposits:', error)
      throw new Error('Failed to update player deposits')
    }
  }
}
