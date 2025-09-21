import { gql } from '@apollo/client';

// Auth Mutations
export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        username
        email
        role
        createdAt
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        username
        email
        role
        createdAt
      }
    }
  }
`;

// Produce/Blockchain Mutations
export const ADD_PRODUCE = gql`
  mutation AddProduce($input: ProduceInput!) {
    addProduce(input: $input) {
      success
      data {
        produceId
        batchNumber
        message
      }
      message
    }
  }
`;

export const TRANSFER_OWNERSHIP = gql`
  mutation TransferOwnership($input: TransferOwnershipInput!) {
    transferOwnership(input: $input) {
      success
      data {
        produceId
        newOwner
        transferDate
      }
      message
    }
  }
`;

export const UPDATE_QUALITY = gql`
  mutation UpdateQuality($input: QualityUpdateInput!) {
    updateQuality(input: $input) {
      success
      data {
        produceId
        grade
        inspectionId
      }
      message
    }
  }
`;

export const REGISTER_PARTICIPANT = gql`
  mutation RegisterParticipant($input: ParticipantInput!) {
    registerParticipant(input: $input) {
      success
      data {
        participantId
        participantType
      }
      message
    }
  }
`;

// Transaction Mutations
export const SUBMIT_TRANSACTION = gql`
  mutation SubmitTransaction($input: TransactionInput!) {
    submitTransaction(input: $input) {
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
      }
      createdAt
    }
  }
`;

export const BATCH_UPLOAD_TRANSACTIONS = gql`
  mutation BatchUploadTransactions($file: Upload!) {
    batchUploadTransactions(file: $file) {
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

// Admin Mutations
export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($userId: ID!, $role: UserRole!) {
    updateUserRole(userId: $userId, role: $role) {
      id
      username
      email
      role
      updatedAt
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId)
  }
`;