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

// Produce/Blockchain Queries
export const GET_PRODUCE_TRACE = gql`
  query GetProduceTrace($produceId: String!) {
    getProduceTrace(produceId: $produceId) {
      success
      data {
        produceInfo {
          id
          batchNumber
          type
          variety
          status
        }
        origin {
          farmerId
          farmName
          harvestDate
          location {
            address
            region
            country
          }
        }
        currentStatus {
          owner {
            participantId
            participantType
            ownershipDate
          }
          location
        }
        supplyChain {
          previousOwner
          newOwner
          transferDate
          transferReason
          transferPrice
        }
        quality {
          currentGrade
          expiryDate
        }
        pricing {
          currentPrice {
            price
            currency
            priceType
          }
          priceHistory {
            price
            currency
            priceType
            date
            participantId
          }
        }
        certifications {
          type
          certifiedBy
          validUntil
        }
        timeline {
          eventType
          eventDate
          participantId
          description
        }
      }
      message
    }
  }
`;

export const GET_ALL_PRODUCE = gql`
  query GetAllProduce($limit: Int, $offset: Int) {
    getAllProduce(limit: $limit, offset: $offset) {
      success
      data {
        id
        batchNumber
        type
        variety
        status
        farmerId
        farmName
        harvestDate
        currentGrade
        currentOwner
      }
      message
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