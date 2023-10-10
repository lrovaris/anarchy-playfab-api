import { Injectable } from '@nestjs/common'
import axios from 'axios'

@Injectable()
export class PlayFabService {
  private readonly baseUrl = 'https://FC69B.playfabapi.com' // Replace FC69B with your titleId
  private readonly secretKey =
    'Y9KTNA4K9A6DHC9I84HP3XWOKH913A8OMMG58UPXZIOAI3IX7I' // Use environment variables in production!

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
      throw new Error(`Failed to fetch all segments: ${error.message}`)
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
      throw new Error(`Failed to fetch players in segment: ${error.message}`)
    }
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
      const displayNameExists =
        accountInfoResponse.data &&
        accountInfoResponse.data.AccountInfo &&
        accountInfoResponse.data.AccountInfo.TitleInfo &&
        accountInfoResponse.data.AccountInfo.TitleInfo.DisplayName

      if (!spriteDataExists) {
        await this.updateUserData(playFabId, {
          Body: 'Naked'
        })
      }

      if (!displayNameExists) {
        await this.updateDisplayName(playFabId, 'Default')
      }

      return response.data
    } catch (error) {
      let errorMessage = 'Failed to login with Google: '

      if (error.response && error.response.data) {
        errorMessage += `${error.response.data.error} - ${error.response.data.errorMessage}`
      } else {
        errorMessage += error.message
      }

      throw new Error(errorMessage)
    }
  }

  async updateUserData(playerId: string, spritesData: object): Promise<any> {
    try {
      const requestBody = {
        PlayFabId: playerId,
        Data: {
          spritesData: JSON.stringify(spritesData)
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
        errorMessage += error.message
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
      throw new Error(`Failed to update display name: ${error.message}`)
    }
  }

  // This is an example method to fetch user data. You might already have an implementation for this.
  async getUserData(playFabId: string): Promise<any> {
    const requestBody = { PlayFabId: playFabId }
    return await axios.post(`${this.baseUrl}/Server/GetUserData`, requestBody, {
      headers: {
        'X-SecretKey': this.secretKey
      }
    })
  }

  // This is an example method to fetch account info. You might already have an implementation for this.
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
}
