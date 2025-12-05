import { gql } from "@apollo/client";
export const UpsertConverstion = gql`
  mutation UpsertConversation($employee_id: Int!, $title: String!) {
    insert_conversations_one(
      object: { employee_id: $employee_id, title: $title }
      on_conflict: { constraint:conversations_employee_id_title_key, update_columns: [] }
    ) {
      id
    }
  }
  `
export const InsertChatMessage = gql`
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
  export const GET_CONVERSATION = gql`
    query GetConversation($employee_id: Int!, $title: String!) {
      conversations(where: { employee_id: { _eq: $employee_id }, title: { _eq: $title } }) {
        id
      }
    }
  `;

  export const GET_CHATS_IN_CONVERSATIONS = gql`
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
