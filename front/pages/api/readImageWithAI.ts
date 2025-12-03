import type { NextApiRequest, NextApiResponse } from 'next'
import { readImageWithAI } from "@/lib/ai/readImage";
// import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = {
  message: string
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ message: 'Hello from Next.js!' })
}
 
// type ResponseData = {
//   result: any;
// };
// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: '50mb',
//     },
//   },
// }
//
//  export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ResponseData>
// ) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ result: "Only POST allowed" });
//   }
//   const { image } = req.body;
//   console.log(image);
//   const data = await readImageWithAI(image);
//   const result = data.structuredResponse;
//   res.status(200).json({result})
// }
