import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAgent } from "langchain";
import z from 'zod';

export async function readImageWithAI(image_base64:string){
  const visionModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
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
    firstName: z.string(),
    lastName:  z.string(),
    age: z.number(),
    phoneNumber: z.string(),
    email: z.email(),
  }) 

  const agent = createAgent({
    model:visionModel,
    tools:[],
    responseFormat
  })

  const res = await agent.invoke(
        { messages: [ { role: "user", content } ]},
  )
  return res

  // for await ( const chunk of stream ){
  //   const [step, content] = Object.entries(chunk)[0];
  //   console.log(`step: ${step}`);
  //   console.log(`content: ${JSON.stringify(content, null, 2)}`);
  // }
}

