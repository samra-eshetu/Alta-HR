import { Injectable } from '@nestjs/common';

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAgent, initChatModel, ReactAgent } from "langchain";
import z from 'zod';
import { HistoryService } from './utils/history.service';
import { getEmployeeInfoTool, listEmployeesTool, searchEmployeeTool } from './utils/toolCalls';
import { HasuraService } from './utils/hasura.service';
import { ChatBotSytemPrompt } from './utils/systemPrompts';

@Injectable()
export class AppService {
  chatAgent:ReactAgent
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
  async chatService(conversationId: string, message: string) {
    try {
      console.log({conversationId,message})
      const previousMessages = await this.historyService.getChatsInConversation(conversationId);
      const historical = previousMessages.map(msg => ({
          role: msg.sender_type === "user" ? "user" : "assistant",
          content: msg.content,
      }));

      const MAX_CONTEXT  = 6;

      const combinedHistory = [
        ...historical.slice(-MAX_CONTEXT),
        { role: "user", content: message },
      ];

      const resp = await this.chatAgent.invoke({
        messages: combinedHistory,
      });

      return resp.messages.at(-1)?.content;
    } catch (err) {
      console.error("chatService error", err);
      return "Something went wrong.";
    }
  }
}
