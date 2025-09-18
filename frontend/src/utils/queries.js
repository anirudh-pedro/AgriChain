import { gql } from '@apollo/client';

// Auth Queries
export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
      role
      createdAt
      updatedAt
    }
  }
`;

// Transaction Queries
export const GET_TRANSACTIONS = gql`
  query GetTransactions($filter: TransactionFilter, $limit: Int, $offset: Int) {
    transactions(filter: $filter, limit: $limit, offset: $offset) {
      id
      transactionId
      data
      hash
      timestamp
      status
      blockNumber
      validated
      submittedBy {
        id
        username
        email
        role
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_TRANSACTION = gql`
  query GetTransaction($id: ID!) {
    transaction(id: $id) {
      id
      transactionId
      data
      hash
      timestamp
      status
      blockNumber
      validated
      submittedBy {
        id
        username
        email
        role
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_TRANSACTION_BY_HASH = gql`
  query GetTransactionByHash($hash: String!) {
    transactionByHash(hash: $hash) {
      id
      transactionId
      data
      hash
      timestamp
      status
      blockNumber
      validated
      submittedBy {
        id
        username
        email
        role
      }
      createdAt
      updatedAt
    }
  }
`;

// Batch Upload Queries
export const GET_BATCH_UPLOADS = gql`
  query GetBatchUploads($limit: Int, $offset: Int) {
    batchUploads(limit: $limit, offset: $offset) {
      id
      filename
      totalRecords
      processedRecords
      failedRecords
      status
      uploadedBy {
        id
        username
        email
      }
      createdAt
      errors
    }
  }
`;

export const GET_BATCH_UPLOAD = gql`
  query GetBatchUpload($id: ID!) {
    batchUpload(id: $id) {
      id
      filename
      totalRecords
      processedRecords
      failedRecords
      status
      uploadedBy {
        id
        username
        email
      }
      createdAt
      errors
      successfulTransactions {
        id
        transactionId
        hash
        status
      }
    }
  }
`;

// Analytics Queries
export const GET_TRANSACTION_STATS = gql`
  query GetTransactionStats {
    transactionStats {
      totalTransactions
      pendingTransactions
      confirmedTransactions
      failedTransactions
      transactionsToday
      transactionsThisWeek
      transactionsThisMonth
    }
  }
`;

export const GET_USER_STATS = gql`
  query GetUserStats {
    userStats {
      totalUsers
      activeUsers
      usersByRole {
        role
        count
      }
    }
  }
`;

// Admin Queries
export const GET_USERS = gql`
  query GetUsers($limit: Int, $offset: Int) {
    users(limit: $limit, offset: $offset) {
      id
      username
      email
      role
      createdAt
      updatedAt
    }
  }
`;