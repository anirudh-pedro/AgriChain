const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # User Types
  type User {
    id: ID!
    username: String!
    email: String!
    role: UserRole!
    name: String
    organization: String
    location: String
    phone: String
    createdAt: String!
    updatedAt: String!
  }

  enum UserRole {
    admin
    farmer
    distributor
    retailer
    consumer
  }

  type AuthPayload {
    success: Boolean!
    message: String!
    token: String
    user: User
  }

  type AuthResponse {
    success: Boolean!
    message: String!
    token: String
    user: User
  }

  type TokenValidation {
    valid: Boolean!
    user: User
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
    role: UserRole = consumer
    name: String
    organization: String
    location: String
    phone: String
  }

  input UpdateProfileInput {
    username: String
    name: String
    organization: String
    location: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ResetPasswordInput {
    token: String!
    password: String!
  }

  type ResetPasswordResponse {
    success: Boolean!
    message: String!
  }

  type ForgotPasswordResponse {
    success: Boolean!
    message: String!
  }

  type ValidateResetTokenResponse {
    valid: Boolean!
    message: String!
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
    validateToken: TokenValidation
    validateResetToken(token: String!): ValidateResetTokenResponse!

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

    # === Fabric Blockchain Queries ===
    blockchainData(id: String!): BlockchainData
    allBlockchainData: [BlockchainQueryResult!]!
    blockchainDataByType(type: String!): [BlockchainQueryResult!]!
    blockchainDataHistory(id: String!): [BlockchainData!]! # Admin/Auditor only
  }

  # Mutations
  type Mutation {
    # Authentication
    register(input: RegisterInput!): AuthResponse!
    login(input: LoginInput!): AuthResponse!
    updateProfile(input: UpdateProfileInput!): AuthResponse!
    forgotPassword(email: String!): ForgotPasswordResponse!
    resetPassword(input: ResetPasswordInput!): ResetPasswordResponse!

    # Transactions
    submitTransaction(input: TransactionInput!): Transaction!
    batchUploadTransactions(file: Upload!): BatchUpload!

    # Admin mutations
    updateUserRole(userId: ID!, role: UserRole!): User! # Admin only
    deleteUser(userId: ID!): Boolean! # Admin only

    # === Fabric Blockchain Mutations ===
    createBlockchainData(input: BlockchainDataInput!): BlockchainResult!
    verifyBlockchainData(dataId: String!): BlockchainResult!
  }

  # === Blockchain Types ===
  
  type BlockchainResult {
    id: String!
    success: Boolean!
    blockchainTxId: String
    message: String!
    data: BlockchainData
  }

  type BlockchainData {
    id: String!
    type: String!
    timestamp: String!
    verified: Boolean!
    createdBy: String
    verifiedBy: String
    verifiedAt: String
  }

  type BlockchainQueryResult {
    Key: String!
    Record: BlockchainData!
  }

  input BlockchainDataInput {
    type: String!
    farmerId: String
    cropType: String
    quantity: String
    unit: String
    location: String
    quality: String
    processType: String
    sourceDataId: String
    inputQuantity: String
    outputQuantity: String
    outputProduct: String
    customData: String # JSON string for flexible data
  }

  # File upload scalar
  scalar Upload
`;

module.exports = typeDefs;