import { Injectable } from '@nestjs/common';
import { HasuraService } from './hasura.service';
import { GET_CHATS_IN_CONVERSATIONS, GET_CONVERSATION } from './queries';

@Injectable()
export class HistoryService {
  constructor(private readonly hasuraService: HasuraService) {}

  async getConversation(employee_id: number, title: string) {
    const res = await this.hasuraService.query(GET_CONVERSATION, { employee_id, title });
    return res.conversations[0] || null;
  }

  async getChatsInConversation(conversation_id: string) {
    const res = await this.hasuraService.query(GET_CHATS_IN_CONVERSATIONS, { conversation_id });
    return res.conversations[0]?.chat_messages || [];
  }

}

