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
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import client from "@/lib/hasura-client";
import { Spinner } from "@/components/ui/spinner";
import "./index.css"

const UpsertConverstion = gql`
  mutation UpsertConversation($employee_id: Int!, $title: String!) {
    insert_conversations_one(
      object: { employee_id: $employee_id, title: $title }
      on_conflict: { constraint:conversations_employee_id_title_key, update_columns: [] }
    ) {
      id
    }
  }
  `
const InsertChatMessage = gql`
  mutation InsertChatMessage($conversation_id: uuid!, $type: String!, $content: String!) {
    insert_chat_messages_one(
      object: {
        conversation_id: $conversation_id,
        sender_type: $type,
        content: $content
      }
    ) {
      id
    }
  }
  `
  const GET_CONVERSATION = gql`
    query GetConversation($employee_id: Int!, $title: String!) {
      conversations(where: { employee_id: { _eq: $employee_id }, title: { _eq: $title } }) {
        id
      }
    }
  `;

  const GET_CHATS_IN_CONVERSATIONS = gql`
    query GetChats($conversation_id: uuid!) {
      conversations(where: { id: { _eq: $conversation_id } }) {
        id
        chat_messages {
          content
          sender_type
        }
      }
    }
  `;
export default function Chat() {
  interface ChatType  {
    type:"user" | "bot";
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
    const BACKENDURL =   process.env.NEXT_PUBLIC_BACKEND_URL
    const res = await axios.post(`${BACKENDURL}chat`, {message:input,conversationId}, {})

    const aiResp: ChatType= {
      type:"bot",
      content: res.data
    }
    const newChat: ChatType= {
      type:"user",
      content:input
    }
    setChat(prev=>[...prev,newChat,aiResp])
    await insertChat({variables:{conversation_id:conversationId,type:"user",content:input}})
    await insertChat({variables:{conversation_id:conversationId,type:"bot",content:res.data}})
    setInput("")
    setLoading(false)
  }
  const onInputKeyDown = (e:any)=>{
    if(e.key=="Enter" && !loading){
      sendMessage()
    }
  }

  return (
    <>
      <div className="flex items-center  h-full  flex-col gap-5">
        <div className='flex flex-col w-[80%]  max-w-[750px] h-full relative'>
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
                            rehypePlugins={[rehypeRaw,rehypeHighlight,rehypeSanitize]}
                          >
                            {item.content}
                          </Markdown>
                        </div>
                      ):(
                        <div className="items-end py-2 px-4 bg-[#313032] rounded-2xl text-white ">{item.content}</div>
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
              <Input type="text" value={input}  onChange={e=>setInput(e.target.value)} placeholder="Ask anything" className=" text-white border-[#313032]  py-4 px-10 bg-[#313032] rounded-2xl w-full"  onKeyDown={onInputKeyDown}/>
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
  )
    </>
  )
}

