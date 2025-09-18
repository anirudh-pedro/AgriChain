const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # User Types
  type User {
    id: ID!
    username: String!
    email: String!
    role: UserRole!
    createdAt: String!
    updatedAt: String!
  }

  enum UserRole {
    ADMIN
    USER
    AUDITOR
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  # Transaction Types
  type Transaction {
    id: ID!
    transactionId: String!
    data: String!
    hash: String!
    timestamp: String!
    submittedBy: User!
    status: TransactionStatus!
    blockNumber: String
    validated: Boolean!
  }

  enum TransactionStatus {
    PENDING
    CONFIRMED
    FAILED
  }

  # Batch Upload Types
  type BatchUpload {
    id: ID!
    filename: String!
    totalRecords: Int!
    processedRecords: Int!
    failedRecords: Int!
    status: BatchStatus!
    uploadedBy: User!
    createdAt: String!
    processingErrors: [String!]
  }

  enum BatchStatus {
    PROCESSING
    COMPLETED
    FAILED
  }

  # Analytics Types
  type TransactionStats {
    totalTransactions: Int!
    pendingTransactions: Int!
    confirmedTransactions: Int!
    failedTransactions: Int!
    transactionsToday: Int!
    transactionsThisWeek: Int!
    transactionsThisMonth: Int!
  }

  type UserStats {
    totalUsers: Int!
    activeUsers: Int!
    usersByRole: [RoleCount!]!
  }

  type RoleCount {
    role: UserRole!
    count: Int!
  }

  # Input Types
  input RegisterInput {
    username: String!
    email: String!
    password: String!
    role: UserRole = USER
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input TransactionInput {
    data: String!
    type: String
    metadata: String
  }

  input TransactionFilter {
    status: TransactionStatus
    submittedBy: ID
    fromDate: String
    toDate: String
    search: String
  }

  # Queries
  type Query {
    # Authentication
    me: User

    # Transactions
    transactions(filter: TransactionFilter, limit: Int = 10, offset: Int = 0): [Transaction!]!
    transaction(id: ID!): Transaction
    transactionByHash(hash: String!): Transaction

    # Batch Uploads
    batchUploads(limit: Int = 10, offset: Int = 0): [BatchUpload!]!
    batchUpload(id: ID!): BatchUpload

    # Analytics
    transactionStats: TransactionStats!
    userStats: UserStats!

    # Admin queries
    users(limit: Int = 10, offset: Int = 0): [User!]! # Admin only
  }

  # Mutations
  type Mutation {
    # Authentication
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!

    # Transactions
    submitTransaction(input: TransactionInput!): Transaction!
    batchUploadTransactions(file: Upload!): BatchUpload!

    # Admin mutations
    updateUserRole(userId: ID!, role: UserRole!): User! # Admin only
    deleteUser(userId: ID!): Boolean! # Admin only
  }

  # File upload scalar
  scalar Upload
`;

module.exports = typeDefs;