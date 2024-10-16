import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    description: "User's Phone number",
    minimum: 1,
    default: 9999999999,
  })
  phone: string;
  @ApiProperty({
    description: "Password",
    default: "Password1!",
  })
  password: string;
}

export class CreateUserDto {
  @ApiProperty({
    description: "User's name",
    default: "username",
  })
  name: string;
  @ApiProperty({
    description: "User's email",
    default: "email@email.com",
  })
  email: string;
  @ApiProperty({
    description: "User's Phone number",
    maximum: 10,
    default: 9999999999,
  })
  phone: string;
  @ApiProperty({
    description: "Password",
    default: "Password1!",
  })
  password: string;
  @ApiProperty()
  refreshToken: string;
}
