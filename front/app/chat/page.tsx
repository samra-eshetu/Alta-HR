'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from 'rehype-sanitize'
import remarkBreaks from 'remark-breaks'
import 'highlight.js/styles/far.css'; // or any other style
import { useMutation, useQuery } from "@apollo/client/react";
import client from "@/lib/hasura-client";
import { Spinner } from "@/components/ui/spinner";
import "./index.css"
import { Textarea } from "@/components/ui/textarea";
import { GET_CHATS_IN_CONVERSATIONS, GET_CONVERSATION, InsertChatMessage, UpsertConverstion } from "@/lib/queries";

export default function Chat() {
  interface ChatType  {
    type:"user" | "bot" | "progress";
    content:string
  }
  const [chat, setChat] = useState<ChatType[]>([
  ]);
  const [input,setInput] = useState("")
  const bottomDiv = useRef<HTMLDivElement>(null);
  const [upsertConv] = useMutation(UpsertConverstion)
  const [insertChat] = useMutation(InsertChatMessage)
  const [conversationId, setConversationId] = useState(null)
  const [loading, setLoading] = useState(false);

  const isInputEmpty = () => input.trim() == ""
  
  // scroll to bottom
  useEffect(() => {
    bottomDiv.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // create converstaion id if already existed give me that one
   useEffect(() => {
    const fetchConversation = async () => {
      const variables = { employee_id: 1, title: "test" };

      // Try upsert
      const resp = await upsertConv({ variables });
      console.log(resp,"resp from upsert")
      const upsertData = resp.data?.insert_conversations_one ;

      if (upsertData?.id) {
        setConversationId(upsertData.id);
      } else {
        // If upsert returned null, query manually
        const queryResp = await client.query({
          query: GET_CONVERSATION,
          variables,
        });
        const conv = queryResp.data.conversations[0];
        if (conv?.id) setConversationId(conv.id);
      }
    };
    fetchConversation();
    // scroll to bottom
    bottomDiv.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  useEffect(()=>{
    if(!conversationId) return
    const fetchMessages = async () =>{
        const queryResp = await client.query({
          query: GET_CHATS_IN_CONVERSATIONS,
          variables:{conversation_id:conversationId},
        });
        const conv = queryResp.data.conversations[0];
        if (conv?.chat_messages){
          for(let i =0 ; i< conv.chat_messages.length;i++){
            const  item =conv.chat_messages[i] 
            setChat(prev=>[...prev,{type:item.sender_type,content:item.content}])
          }
        }
    }
    fetchMessages()
  },[conversationId])

  async function sendMessage (){
    if(isInputEmpty()) return
     setLoading(true)
     setInput("")

    const BACKENDURL =   process.env.NEXT_PUBLIC_BACKEND_URL
    const es = new EventSource(`${BACKENDURL}/chat?conversationId=${conversationId}&message=${input}`);
    const newChat: ChatType= {
      type:"user",
      content:input
    }
    const aiProcess: ChatType= {
      type:"progress",
      content: ""
    }
    const aiResp: ChatType= {
      type:"bot",
      content: ""
    }

    setChat(prev=>[...prev,newChat,aiProcess,aiResp])
    await insertChat({variables:{conversation_id:conversationId,type:"user",content:input}})
    let fullMessage = ""
    es.onmessage = async (e) => {
      const chunk = JSON.parse(e.data) as {type:string,payload:any};

      if(chunk.type == "update"){ // Ai text

        const payload = chunk.payload as string
        // console.log("ai",payload)

      } else if(chunk.type == "progress"){ // log

        const payload = chunk.payload as string
        console.log("progress",payload)
        setChat(prev => {
          if(prev.length === 0) return prev; // safety check
             const botIndex = prev.length - 1;
             const progressIndex = botIndex - 1;
             const updatedMessage = {
                ...prev[progressIndex],
                content: payload
              };
          return [...prev.slice(0, progressIndex),updatedMessage,prev[botIndex]];
        });

      } else if(chunk.type == "token"){

          const token = chunk.payload;
          if(!token) return
          // console.log("token",token)
          fullMessage += token;

          setChat(prev => {
            const botIndex = prev.length - 1;
            const updatedMessage = {
              ...prev[botIndex],
              content: fullMessage
            };
            const newPrev = [...prev];
            newPrev[botIndex] = updatedMessage;
            return newPrev;
          });
      };
    }

    es.onerror = async (e) =>{ // when closed
      // console.log("done",fullMessage)
      setLoading(false)
      es.close();

      const finalResp: ChatType= {
        type:"bot",
        content: fullMessage
      }
      // remove the prev tokens and show the full
      setChat(prev => {
        const lastIndex = prev.length - 1;
        const updatedArray = [...prev.slice(0, lastIndex), finalResp];
        return updatedArray;
      });
      await insertChat({variables:{conversation_id:conversationId,type:"bot",content:fullMessage}})
    } 

  }
  const onInputKeyDown = (e:any)=>{
      if (e.key === "Enter" && !e.shiftKey && !loading) {
          e.preventDefault(); // prevent newline
          sendMessage();
      }
  }

  return (
    <>
      <div className="flex items-center  h-full  flex-col gap-5 bg-linear-to-br from-blue-50 via-white to-indigo-50 ">
        <div className='flex flex-col w-[80%]  max-w-[900px] h-full relative'>
            <div className="overflow-y-auto h-[80%] flex flex-col gap-5 mt-5">
            {
              chat.length > 0 ?(
              chat.map((item,i)=>(
                <div key={i} className={`flex ${item.type=="bot"? "justify-start":"justify-end"} w-full content`}>
                    {
                      item.type =="bot"?(
                        <div className="prose prose-slate">
                          <Markdown
                            remarkPlugins={[remarkGfm,remarkBreaks]}
                            rehypePlugins={[rehypeRaw,rehypeHighlight]}
                          >
                            {item.content}
                          </Markdown>
                        </div>
                      ):(
                          item.type == "progress" ? (
                              <div className="text-indigo-400">{item.content}</div>
                          ):(
                            <div className="items-end py-2 px-4 bg-[#313032] rounded-2xl text-white ">{item.content}</div>
                          )
                      )
                    }

                </div>
              ))
              ):(
                <h1 className="font-bold text-2xl flex  items-center justify-center h-full"> Hello how can I help u </h1>
              )
            }
            <div ref={bottomDiv}></div>
            </div>
            <div className="absolute bottom-2 flex gap-5 items-center w-full">
              <Textarea value={input}  onChange={e=>setInput(e.target.value)} placeholder="Ask anything" className="py-0 px-10 rounded-2xl w-full flex items-center"  onKeyDown={onInputKeyDown}/>
              <Button className={`outline rounded-2xl ${isInputEmpty()? "disabled cursor-not-allowed bg-[#31303250] hover:bg-[#313032] ":"cursor-pointer  text-white " }`} onClick={()=>sendMessage()}>
              Submit
              {
                loading?(
                   <Spinner />
                ):null
              }
            </Button>
            </div>
          </div>
      </div>
    </>
  )
}

