import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Post,
  Body
} from '@nestjs/common'
import {
  ApiQuery,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse
} from '@nestjs/swagger'

import { PlayFabService } from './playfab.service'

@Controller('playfab')
export class PlayFabController {
  constructor(private readonly playFabService: PlayFabService) {}

  @Get('getAllSegments')
  async getAllSegments(): Promise<any> {
    try {
      return await this.playFabService.getAllSegments()
    } catch (error) {
      throw new HttpException(error.errorMessage, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('getPlayersInSegment')
  @Get('getPlayersInSegment')
  @ApiQuery({
    name: 'segmentId',
    required: true,
    description: 'ID of the segment'
  })
  @ApiQuery({
    name: 'continuationToken',
    required: false,
    description: 'Token for continuation (pagination)'
  })
  async getPlayersInSegment(
    @Query('segmentId') segmentId: string,
    @Query('continuationToken') continuationToken?: string
  ): Promise<any> {
    try {
      if (!segmentId) {
        throw new HttpException('segmentId is required', HttpStatus.BAD_REQUEST)
      }
      return await this.playFabService.getPlayersInSegment(
        segmentId,
        continuationToken
      )
    } catch (error) {
      throw new HttpException(
        error.errorMessage || error.message,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  @Post('login-with-google')
  @ApiOperation({ summary: 'Login or register a user with Google' })
  @ApiBody({
    description:
      'Google token received after user signs in with Google on the frontend',
    type: String,
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Returns PlayFab login or registration data'
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error'
  })
  async loginWithGoogle(@Body('token') googleToken: string) {
    return this.playFabService.loginWithGoogle(googleToken)
  }
}
