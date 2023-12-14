import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkDto, messageDTO } from 'src/auth/dto';
import { AuthGuard } from '@nestjs/passport';
@UseGuards(AuthGuard('jwt'))
@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}
  @Post('create')
  createBookmark(@Body() dto: messageDTO) {
    return this.bookmarkService.createBookmark(dto);
  }
  @Get('getBookmark')
  getBookmark() {
    return this.bookmarkService.getBookmark();
  }
  @Get('getBookmark/:id')
  getBookmarkById(@Param('id') id: string) {
    return this.bookmarkService.getBookmarkById(id);
  }

  @Delete('deleteBookmark/:id')
  deleteBookmarkById(@Param('id') id: string) {
    return this.bookmarkService.deleteBookmarkById(id);
  }

  @Put('updateBookmark/:id')
  async updateBookmark(@Param('id') id: string, @Body() updateBookmarkDto: messageDTO) {
   return  await this.bookmarkService.updateBookmark(id, updateBookmarkDto);
  }


  @Post('createBoomark')
  createNewBookmark(@Body() dto: BookmarkDto,@Req() req: any) {
   
    console.log(req.user);
    
    return this.bookmarkService.createNewBookmark(dto,req.user);
  }
}
