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

      const response = await axios.post(
        `${this.baseUrl}/Client/LoginWithGoogleAccount`,
        requestBody,
        {
          headers: {
            'X-SecretKey': this.secretKey
          }
        }
      )
      return response.data
    } catch (error) {
      let errorMessage = 'Failed to login with Google: '

      // Extract the specific error details from the axios response
      if (error.response && error.response.data) {
        errorMessage += `${error.response.data.error} - ${error.response.data.errorMessage}`
      } else {
        errorMessage += error.message
      }

      throw new Error(errorMessage)
    }
  }
}
