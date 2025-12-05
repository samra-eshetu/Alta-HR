import { Body, Controller, Get, Post, Sse,MessageEvent, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PipeTransform, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any) {
    const twentyMb = 20 * 1000 * 1000; // 20 MB

    if (value?.size > twentyMb) {
      throw new Error("File too large");
    }

    return value;
  }
}


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("extractText")
  @UseInterceptors(FileInterceptor("file"))
  async extractText(@UploadedFile(new FileSizeValidationPipe(),) file: Express.Multer.File) {
    if (!file) {
      throw new Error("No file uploaded");
    }
    console.log("file is succesfuly recived")

    // Convert the buffer to base64
    const base64 = file.buffer.toString("base64");

    // Pass it to your AI extraction function
    const extracted = await this.appService.readImageWithAI(base64);
    console.log("response from AI \n", extracted);

    return extracted; // returns structuredResponse
  }

   @Sse('chat')
   chat(
    @Query('message') message: string,
    @Query('conversationId') conversationId: string
  ):Observable<MessageEvent> {
    const response =  this.appService.chatService(conversationId, message);
    return response; 
  }
}
