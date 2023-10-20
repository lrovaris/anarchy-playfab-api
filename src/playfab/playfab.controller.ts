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
@ApiTags('PlayFab')
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

  @Post('update-user-data')
  @ApiOperation({ summary: 'Update user data with traits' })
  @ApiBody({
    description: 'Player ID and their corresponding traits data',
    type: 'object',
    required: true,
    schema: {
      properties: {
        playerId: {
          type: 'string',
          example: 'some_playfab_id'
        },
        spritesData: {
          type: 'object',
          example: {
            Body: 'Naked'
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'User data updated successfully'
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error'
  })
  async updateUserData(
    @Body('playerId') playerId: string,
    @Body('spritesData') spritesData: object
  ): Promise<any> {
    try {
      return await this.playFabService.updateUserData(playerId, spritesData)
    } catch (error) {
      throw new HttpException(
        error.errorMessage || error.message,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  @Post('update-display-name')
  @ApiOperation({ summary: 'Update the display name for a player' })
  @ApiBody({
    description: 'Player ID and the new display name',
    type: 'object',
    required: true,
    schema: {
      properties: {
        playFabId: {
          type: 'string',
          example: 'some_playfab_id'
        },
        newDisplayName: {
          type: 'string',
          example: 'NewDisplayName123'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Display name updated successfully'
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error'
  })
  async updateDisplayName(
    @Body('playFabId') playFabId: string,
    @Body('newDisplayName') newDisplayName: string
  ): Promise<any> {
    try {
      return await this.playFabService.updateDisplayName(
        playFabId,
        newDisplayName
      )
    } catch (error) {
      throw new HttpException(
        error.errorMessage || error.message,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  @Post('update-user-address')
  @ApiOperation({ summary: 'Update the address for a PlayFab user' })
  @ApiBody({
    description: 'Player ID and the new address',
    type: 'object',
    required: true,
    schema: {
      properties: {
        playFabId: {
          type: 'string',
          example: 'some_playfab_id'
        },
        newAddress: {
          type: 'string',
          example: '123 Main St, Springfield, IL'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Address updated successfully'
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error'
  })
  async updateUserAddress(
    @Body('playFabId') playFabId: string,
    @Body('newAddress') newAddress: string
  ): Promise<any> {
    try {
      return await this.playFabService.updateUserAddress(playFabId, newAddress)
    } catch (error) {
      throw new HttpException(
        error.errorMessage || error.message,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  @Post('update-player-balance')
  @ApiOperation({ summary: 'Update player balance' })
  @ApiBody({
    description: 'Player ID and the value to be spent',
    type: 'object',
    required: true,
    schema: {
      properties: {
        playFabId: {
          type: 'string',
          example: 'some_playfab_id'
        },
        spentValue: {
          type: 'number',
          example: 100
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Player balance updated successfully'
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error'
  })
  async updatePlayerBalance(
    @Body('playFabId') playFabId: string,
    @Body('spentValue') spentValue: number
  ): Promise<void> {
    try {
      await this.playFabService.updatePlayerBalance(playFabId, spentValue)
    } catch (error) {
      throw new HttpException(
        error.errorMessage || error.message,
        HttpStatus.BAD_REQUEST
      )
    }
  }
}
