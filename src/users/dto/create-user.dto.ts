import {IsEmail, IsOptional, IsNotEmpty, Min, Max, Matches, IsMongoId, MinLength, MaxLength, Length } from 'class-validator';

export class CreateUserDto {
    @IsOptional()
    @IsEmail({}, {message: 'מייל אינו תקין'})
    email: string;

    @Length(2, 70, {message: 'שם מלא צריך להכיל בין 2-70 תווים'})
    name: string;

    @Length(6, 35, {message: 'סיסמא צריכה להכיל בין 6-35 תווים'})
    password: string;

    @Matches(/^[0]\d{9}$/, 'g', {message: 'טלפון 10 ספרות, מתחיל בספרה 0'})
    phone: string;

    @IsMongoId({each: true, message: 'מזהה ייחודי אינו חוקי'})
    roles: string;

    @IsMongoId({each: true, message: 'מזהה ייחודי אינו חוקי'})
    products: string;
}
