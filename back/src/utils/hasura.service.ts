import { Injectable } from '@nestjs/common';
import { DocumentNode } from 'graphql';
import { GraphQLClient } from 'graphql-request';

@Injectable()
export class HasuraService {
  private client: GraphQLClient;

  constructor() {
    this.client = new GraphQLClient(process.env.HASURA_URL ?? "");
  }

  async query<T = any>(query: DocumentNode, variables?: Record<string, any>) {
    return this.client.request<T>(query, variables);
  }

  async mutate<T = any>(mutation: DocumentNode, variables?: Record<string, any>) {
    return this.client.request<T>(mutation, variables);
  }
}

