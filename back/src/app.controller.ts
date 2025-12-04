import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PipeTransform, Injectable } from '@nestjs/common';

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

   @Post('chat')
   async chat(@Body() body: { message: string; conversationId: string }) {
    const { message, conversationId } = body;
    console.log(message)

    if (!message) {
      return "No message provided";
    }

    const response = await this.appService.chatService(conversationId, message);
    console.log(response)
    return response; // returns a plain string
  }
}
