import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class InvitacionUsuarioDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nombreCompleto: string;

  @IsString()
  @IsNotEmpty()
  rol: string;

  @IsString()
  token : string
}