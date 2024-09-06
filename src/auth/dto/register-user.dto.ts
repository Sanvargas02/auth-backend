import { IsDateString, IsEmail, IsNumber, IsOptional, IsString, MinLength } from "class-validator";


export class RegisterUserDto {

    @IsEmail() 
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;

    @IsOptional()   // optional field
    @IsDateString()     
    birthDate?: string;

    @IsOptional()   // optional field
    @IsString()     
    rol?: string;

}