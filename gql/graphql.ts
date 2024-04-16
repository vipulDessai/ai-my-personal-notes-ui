/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `DateTime` scalar represents an ISO-8601 compliant date time type. */
  DateTime: { input: any; output: any; }
  /** The `Long` scalar type represents non-fractional signed whole 64-bit numeric values. Long can represent values between -(2^63) and 2^63 - 1. */
  Long: { input: any; output: any; }
};

export enum ApplyPolicy {
  AfterResolver = 'AFTER_RESOLVER',
  BeforeResolver = 'BEFORE_RESOLVER',
  Validation = 'VALIDATION'
}

export type DeleteNotesOutput = {
  __typename?: 'DeleteNotesOutput';
  data?: Maybe<DeleteResult>;
  message: Scalars['String']['output'];
};

export type DeleteNotesReqInput = {
  notesIds?: InputMaybe<Array<Scalars['String']['input']>>;
  tagsIds?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type DeleteResult = {
  __typename?: 'DeleteResult';
  deletedCount: Scalars['Long']['output'];
  isAcknowledged: Scalars['Boolean']['output'];
};

export type DeleteTagOutput = {
  __typename?: 'DeleteTagOutput';
  data?: Maybe<DeleteResult>;
  message: Scalars['String']['output'];
};

export type GetNotesOutput = {
  __typename?: 'GetNotesOutput';
  notes: Array<KeyValuePairOfStringAndNoteSchema>;
};

export type GetNotesReqInput = {
  batchSize?: InputMaybe<Scalars['Int']['input']>;
  filterKey?: InputMaybe<Scalars['String']['input']>;
  filterValue?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  tagsIds?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type GetTagsOutput = {
  __typename?: 'GetTagsOutput';
  tags: Array<KeyValuePairOfStringAndNoteTags>;
};

export type GetTagsReqInput = {
  batchSize?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  tagsIds?: InputMaybe<Array<Scalars['String']['input']>>;
  tagsName?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type KeyValuePairOfStringAndNoteSchema = {
  __typename?: 'KeyValuePairOfStringAndNoteSchema';
  key: Scalars['String']['output'];
  value: NoteSchema;
};

export type KeyValuePairOfStringAndNoteTags = {
  __typename?: 'KeyValuePairOfStringAndNoteTags';
  key: Scalars['String']['output'];
  value: NoteTags;
};

export type KeyValuePairOfStringAndStringInput = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteNotes: DeleteNotesOutput;
  deleteTags: DeleteTagOutput;
  token: Scalars['String']['output'];
  updateNote: UpdateNoteOutput;
  updateTags: UpdateTagsOutput;
};


export type MutationDeleteNotesArgs = {
  input: DeleteNotesReqInput;
};


export type MutationDeleteTagsArgs = {
  tags: Array<Scalars['String']['input']>;
};


export type MutationTokenArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationUpdateNoteArgs = {
  input: UpdateNotesReqInput;
};


export type MutationUpdateTagsArgs = {
  input: UpdateTagsReqInput;
};

export type NoteInputs = {
  __typename?: 'NoteInputs';
  childInputs?: Maybe<Array<NoteInputs>>;
  tags?: Maybe<Array<Scalars['String']['output']>>;
  value?: Maybe<Scalars['String']['output']>;
};

export type NoteInputsInput = {
  childInputs?: InputMaybe<Array<NoteInputsInput>>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type NoteSchema = {
  __typename?: 'NoteSchema';
  date: Scalars['DateTime']['output'];
  inputData?: Maybe<Array<NoteInputs>>;
  tags?: Maybe<Array<Scalars['String']['output']>>;
  title?: Maybe<Scalars['String']['output']>;
  updatedDate?: Maybe<Scalars['DateTime']['output']>;
};

export type NoteSchemaInput = {
  date: Scalars['DateTime']['input'];
  inputData?: InputMaybe<Array<NoteInputsInput>>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedDate?: InputMaybe<Scalars['DateTime']['input']>;
};

export type NoteTags = {
  __typename?: 'NoteTags';
  name?: Maybe<Scalars['String']['output']>;
};

export type NoteTagsInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  notes: GetNotesOutput;
  tags: GetTagsOutput;
};


export type QueryNotesArgs = {
  input: GetNotesReqInput;
};


export type QueryTagsArgs = {
  input: GetTagsReqInput;
};

export type UpdateNoteOutput = {
  __typename?: 'UpdateNoteOutput';
  message: Scalars['String']['output'];
};

export type UpdateNoteTagOpResult = {
  __typename?: 'UpdateNoteTagOpResult';
  matchedCount: Scalars['Long']['output'];
  modifiedCount: Scalars['Long']['output'];
};

export type UpdateNotesReqInput = {
  newTags: Array<NoteTagsInput>;
  note: NoteSchemaInput;
  noteId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTagsOutput = {
  __typename?: 'UpdateTagsOutput';
  data?: Maybe<Array<UpdateNoteTagOpResult>>;
  message: Scalars['String']['output'];
};

export type UpdateTagsReqInput = {
  newTags?: InputMaybe<Array<NoteTagsInput>>;
  updateTagsData?: InputMaybe<Array<KeyValuePairOfStringAndStringInput>>;
};

export type GetTokenMutationVariables = Exact<{
  email: Scalars['String']['input'];
  pwd: Scalars['String']['input'];
}>;


export type GetTokenMutation = { __typename?: 'Mutation', token: string };

export type AddNoteMutationVariables = Exact<{
  newTags: Array<NoteTagsInput> | NoteTagsInput;
  title?: InputMaybe<Scalars['String']['input']>;
  date: Scalars['DateTime']['input'];
  primaryTags?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  inputData?: InputMaybe<Array<NoteInputsInput> | NoteInputsInput>;
}>;


export type AddNoteMutation = { __typename?: 'Mutation', updateNote: { __typename?: 'UpdateNoteOutput', message: string } };

export type GetNoteInBatchQueryVariables = Exact<{
  size: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
}>;


export type GetNoteInBatchQuery = { __typename?: 'Query', notes: { __typename?: 'GetNotesOutput', notes: Array<{ __typename?: 'KeyValuePairOfStringAndNoteSchema', key: string, value: { __typename?: 'NoteSchema', title?: string | null, tags?: Array<string> | null, date: any, updatedDate?: any | null, inputData?: Array<{ __typename?: 'NoteInputs', value?: string | null }> | null } }> } };

export type GetTagsQueryVariables = Exact<{
  tagsIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type GetTagsQuery = { __typename?: 'Query', tags: { __typename?: 'GetTagsOutput', tags: Array<{ __typename?: 'KeyValuePairOfStringAndNoteTags', key: string, value: { __typename?: 'NoteTags', name?: string | null } }> } };


export const GetTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"getToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pwd"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pwd"}}}]}]}}]} as unknown as DocumentNode<GetTokenMutation, GetTokenMutationVariables>;
export const AddNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newTags"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NoteTagsInput"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"primaryTags"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inputData"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NoteInputsInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"note"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"inputData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inputData"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"tags"},"value":{"kind":"Variable","name":{"kind":"Name","value":"primaryTags"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"newTags"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newTags"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<AddNoteMutation, AddNoteMutationVariables>;
export const GetNoteInBatchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getNoteInBatch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"batchSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"updatedDate"}},{"kind":"Field","name":{"kind":"Name","value":"inputData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetNoteInBatchQuery, GetNoteInBatchQueryVariables>;
export const GetTagsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTags"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tagsIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tags"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"tagsIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tagsIds"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetTagsQuery, GetTagsQueryVariables>;