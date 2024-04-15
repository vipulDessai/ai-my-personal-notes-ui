/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation getToken($email: String!, $pwd: String!) {\n    token(email: $email, password: $pwd)\n  }\n": types.GetTokenDocument,
    "\n  query getNoteInBatch($size: Int!, $page: Int!) {\n    notes(input: { batchSize: $size, page: $page }) {\n      notes {\n        key\n        value {\n          title\n          tags\n          date\n          updatedDate\n          inputData {\n            value\n          }\n        }\n      }\n    }\n  }\n": types.GetNoteInBatchDocument,
    "\n  query getTags($tagsIds: [String!]!) {\n    tags(input: {\n      tagsIds: $tagsIds\n    }) {\n      tags {\n        key\n        value {\n          name\n        }\n      }\n    }\n  }\n": types.GetTagsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation getToken($email: String!, $pwd: String!) {\n    token(email: $email, password: $pwd)\n  }\n"): (typeof documents)["\n  mutation getToken($email: String!, $pwd: String!) {\n    token(email: $email, password: $pwd)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getNoteInBatch($size: Int!, $page: Int!) {\n    notes(input: { batchSize: $size, page: $page }) {\n      notes {\n        key\n        value {\n          title\n          tags\n          date\n          updatedDate\n          inputData {\n            value\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getNoteInBatch($size: Int!, $page: Int!) {\n    notes(input: { batchSize: $size, page: $page }) {\n      notes {\n        key\n        value {\n          title\n          tags\n          date\n          updatedDate\n          inputData {\n            value\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getTags($tagsIds: [String!]!) {\n    tags(input: {\n      tagsIds: $tagsIds\n    }) {\n      tags {\n        key\n        value {\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getTags($tagsIds: [String!]!) {\n    tags(input: {\n      tagsIds: $tagsIds\n    }) {\n      tags {\n        key\n        value {\n          name\n        }\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;