// schemas/cat.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class User extends Document {
  @Prop()
  address: string

  @Prop()
  name: string

  @Prop()
  deposits: any[]
}

export const UsersSchema = SchemaFactory.createForClass(User)
