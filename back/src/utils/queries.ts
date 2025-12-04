import { gql } from "@apollo/client";

export const GET_INDIVIDUAL_EMPLOYEE  = gql `
query getEmployee($first_name: String, $last_name: String, $email: String) {
  employees(
    where: {
      _or: [
        { first_name: { _ilike: $first_name } },
        { last_name: { _ilike: $last_name } },
        { email: { _eq: $email } }
      ]
    }
  ) {
    first_name
    last_name
    email
  }
}
`
export const GET_ALL_EMPLOYEE  = gql`
  query getEmployee($limit: Int, $offset: Int , $order_by: [employees_order_by!]) {
    employees(limit: $limit, offset: $offset, order_by:$order_by) {
      first_name
      last_name
      email
      phone
      hire_date
      gender
      national_id
      role_id
      department_id
      date_of_birth
      created_at
      updated_at
    }
  }
`
export const SEARCH_ALL_EMPLOYEE  = gql`
  query getEmployee($where: any) {
    employees(where: $where) {
      first_name
      last_name
      email
      phone
      hire_date
      gender
      national_id
      role_id
      department_id
      date_of_birth
      created_at
      updated_at
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
