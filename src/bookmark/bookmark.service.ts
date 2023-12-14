import { Injectable, NotFoundException } from '@nestjs/common';
import { log } from 'console';
import { BookmarkDto, messageDTO } from 'src/auth/dto';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  async createBookmark(dto: messageDTO) {
    const data = await this.prisma.message.create({
      data: {
        title: dto.title,
        description: dto.description,
      },
    });
    console.log('-------', data);
    return {
      data,
    };
  }

  async createNewBookmark(dto:BookmarkDto,userId:any){
    const { title, description, link } = dto;
    console.log('service---',userId);
    
    const data = await this.prisma.bookmark.create({
      data: {
        title,
        description,
        link,
        user: {
          connect: {
            id: userId.userId // Make sure `userId` is a valid ID of the user
          }
        } // Connects the bookmark to the logged-in user by ID
      },
    });
   
    return {
      data
    };
  }

  async getBookmark() {
    const data = await this.prisma.message.findMany();

    return {
      data,
    };
  }
  async getBookmarkById(id: string) {
    const idNo: number = +id;
    const data = await this.prisma.message.findUnique({
      where: { id: idNo },
    });

    return {
      data,
    };
  }
  async deleteBookmarkById(id: string) {
    const idNo: number = +id;
    const data = await this.prisma.message.delete({
      where: { id: idNo },
    });

    if (data) {
      return {
        msg: 'Deleted Successfully',
      };
    } else {
      return {
        msg: 'Something went wrong',
      };
    }
  }

  async updateBookmark(id: string, data: messageDTO) {
    const { title, description } = data;
    const idNo: number = +id;
    console.log(idNo, title, description);
    const existingUser = await this.prisma.message.findUnique({
      where: { id: idNo },
    });
    console.log(existingUser);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Update user fields
    const updatedUser = await this.prisma.message.update({
      where: { id: idNo },
      data: {
        title,
        description,
      },
    });

    return updatedUser;
  }
}
