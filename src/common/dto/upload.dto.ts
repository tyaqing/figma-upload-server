import { IsNotEmpty } from 'class-validator'

export class UploadDto {
  @IsNotEmpty()
  figmaUserId: string
  @IsNotEmpty()
  figmaUserName: string
  @IsNotEmpty()
  bucket: string
  @IsNotEmpty()
  path: string
}
