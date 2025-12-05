import { Injectable,MessageEvent,Logger } from '@nestjs/common';

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAgent, initChatModel, ReactAgent } from "langchain";
import z from 'zod';
import { HistoryService } from './utils/history.service';
import { getEmployeeInfoTool, listEmployeesTool, searchEmployeeTool } from './utils/toolCalls';
import { HasuraService } from './utils/hasura.service';
import { ChatBotSytemPrompt } from './utils/systemPrompts';
import { Observable } from 'rxjs';

@Injectable()
export class AppService {
  private chatAgent:ReactAgent
  private readonly logger = new Logger(AppService.name);
  constructor(private readonly historyService: HistoryService,private readonly hasuraService: HasuraService){

  }

  getHello(): string {
    return 'Hello World!';
  }
  async onModuleInit(){
      const model = await initChatModel("google-genai:gemini-2.5-flash-lite");
      this.chatAgent = createAgent({
        model,
        tools:[getEmployeeInfoTool(this.hasuraService), searchEmployeeTool(this.hasuraService),listEmployeesTool(this.hasuraService)],
        systemPrompt: ChatBotSytemPrompt,
      });
  }
  async readImageWithAI(image_base64:string){
      const visionModel = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        maxOutputTokens: 2048,
      });
      const typeofForm = "Employee record"
      const content = [
        {
          type: "text",
          text: `
            Extract all fields from this ${typeofForm}. 
            IMPORTANT:
            - The form may contain Amharic names.
            - DO NOT translate, do not transliterate, do not romanize, and do not modify any Amharic text.
            - Return Amharic names exactly as they appear in the image.
            `,
            },
        {
          type: "image_url",
          image_url: `data:image/png;base64,${image_base64}`,
        },
      ]
      const responseFormat =z.object({
        firstName: z.string().describe("first name "),
        lastName:  z.string().describe("last name"),
        dateOfBirth: z.string().describe("date of birth in dd/MM/yyyy format"),
        phoneNumber: z.string().describe("phone number if exist"),
        email: z.email().describe("email"),
      }) 

      const agent = createAgent({
        model:visionModel,
        tools:[],
        responseFormat
      })

      const res = await agent.invoke(
          { messages: [ { role: "user", content } ]},
      )
      return res.structuredResponse
  }
  chatService(conversationId: string, message: string) {
    return new Observable<MessageEvent>((subscriber) => {
      (async () => {
        try {
          const previousMessages = await this.historyService.getChatsInConversation(conversationId);

          const historical = previousMessages.map(msg => ({
            role: msg.sender_type === "user" ? "user" : "assistant",
            content: msg.content,
          }));

          const MAX_CONTEXT = 6;

          const combinedHistory = [
            // ...historical.slice(-MAX_CONTEXT),
            { role: "user", content: message },
          ];

          const stream = await this.chatAgent.stream({
            messages: combinedHistory,
          },{streamMode:["custom","updates","messages"]});
          let line =""

          for await (const chunk of stream) {
            if(chunk[0] === "custom"){
              this.logger.verbose(`custom: ${JSON.stringify(chunk[1])}`);
              subscriber.next({ data: {type:"progress",payload: chunk[1]} });
            }
            else if( chunk[0] === "updates"){
              const chunkResp =chunk[1]
              if(chunkResp.model_request){
                const content = chunkResp.model_request.messages[0].content;
                if(typeof content == "string"){
                   // this.logger.debug(`Update content: ${content}`);
                   subscriber.next({data:{type:"update",payload:content}})
                }
              }
            }
            else if(chunk[0] == "messages"){
              const chunkResp = chunk[1]
              const content = chunkResp[0].content
              try{
                if(typeof content == "string"){
                   JSON.parse(content)
                }
              }catch(e){
                if (typeof content === "string") {
                    line += content; // append chunk to buffer

                    let newlineIndex;
                    while ((newlineIndex = line.indexOf("\n")) !== -1) {

                      // extract line up to newline
                      const completeLine = line.slice(0, newlineIndex);

                      subscriber.next({ data: { type: "token", payload: completeLine +"\n" } });

                      this.logger.debug(`line: ${completeLine}`);

                      // remove processed line + newline
                      line = line.slice(newlineIndex + 1);
                    }
                }
              }

            }
          }
          if (line.length > 0) {
            subscriber.next({ data: { type: "token", payload: line } });
            line = "";
          }
          subscriber.complete();
        } catch (err) {
          this.logger.error("Error",err)
          subscriber.error(err);
        }
      })();
   });
  }
}
