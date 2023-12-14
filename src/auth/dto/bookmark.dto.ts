import {IsNotEmpty, IsString } from 'class-validator';

export class BookmarkDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
 description: string;

  @IsString()
  @IsNotEmpty()
  link:string;


  userId:any


}
