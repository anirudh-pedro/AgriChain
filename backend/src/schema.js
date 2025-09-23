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
    # Farmer-specific fields
    aadhaarId: String
    landLocation: String
    typeOfProduce: String
    # Distributor/Retailer-specific fields
    gstin: String
    businessName: String
    contactPerson: String
    businessAddress: String
    licenseNumber: String
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

  # Produce Types
  type Produce {
    id: ID!
    cropName: String!
    farmer: User!
    quantity: String!
    price: Float!
    unit: String!
    harvestDate: String!
    farmLocation: String!
    description: String
    quality: String!
    organic: Boolean!
    status: ProduceStatus!
    createdAt: String!
    updatedAt: String!
    # Blockchain tracking
    blockchainId: String
    journey: [JourneyStep!]!
  }

  enum ProduceStatus {
    AVAILABLE
    SOLD
    IN_TRANSIT
    DELIVERED
  }

  # Journey Step Types
  type JourneyStep {
    id: ID!
    stage: String!
    title: String!
    actor: String!
    date: String!
    time: String!
    location: String!
    description: String!
    status: StepStatus!
    verifiedBy: String
    blockchainHash: String!
    details: JourneyDetails
  }

  type JourneyDetails {
    farmingMethod: String
    seedVariety: String
    waterSource: String
    pesticides: String
    harvestWeight: String
    qualityGrade: String
    harvestConditions: String
    packagingDate: String
    transportVehicle: String
    temperature: String
    transitTime: String
    qualityCheck: String
    receivedQuantity: String
    qualityInspection: String
    shelfLife: String
    pricePerKg: String
    purchaseQuantity: String
    purchaseAmount: String
    paymentMethod: String
    customerSatisfaction: String
  }

  enum StepStatus {
    COMPLETED
    CURRENT
    PENDING
  }

  # Traceability Types
  type TraceabilityData {
    productId: String!
    productName: String!
    batchId: String!
    qrCode: String!
    currentStatus: String!
    totalQuantity: String!
    currentLocation: String!
    journey: [JourneyStep!]!
    verificationBadges: [VerificationBadge!]!
  }

  type VerificationBadge {
    type: String!
    verified: Boolean!
    description: String!
  }

  # QR Code Types
  type QRCodeData {
    qrCodeUrl: String!
    productId: String!
    data: String!
    expiresAt: String
  }

  # Transaction History Types
  type TransactionHistoryItem {
    id: ID!
    transactionId: String!
    date: String!
    time: String!
    type: TransactionType!
    product: String!
    quantity: String!
    amount: Float!
    participant: String! # buyer/seller name
    status: TransactionHistoryStatus!
    blockchainHash: String!
    productId: String
    paymentMethod: String
    commission: Float
    netAmount: Float
    location: String
    deliveryStatus: String
    expectedDelivery: String
    profit: Float
    margin: String
    deliveryAddress: String
    rating: Int
    source: String
  }

  enum TransactionType {
    SALE
    PURCHASE
    PLATFORM_FEE
  }

  enum TransactionHistoryStatus {
    COMPLETED
    PENDING
    FAILED
    IN_TRANSIT
  }

  # Analytics Types for Charts
  type MonthlyEarnings {
    month: String!
    earnings: Float!
    sales: Int!
    volume: Float!
  }

  type ProductDistribution {
    name: String!
    value: Float!
    count: Int!
    revenue: Float!
  }

  type BuyerTypes {
    name: String!
    value: Float!
    transactions: Int!
  }

  type SeasonalTrends {
    season: String!
    production: Float!
    demand: Float!
    price: Float!
  }

  type PlatformMetrics {
    month: String!
    users: Int!
    transactions: Int!
    revenue: Float!
  }

  type UserGrowth {
    type: String!
    count: Int!
    growth: Float!
  }

  type AnalyticsData {
    monthlyEarnings: [MonthlyEarnings!]
    productDistribution: [ProductDistribution!]
    buyerTypes: [BuyerTypes!]
    seasonalTrends: [SeasonalTrends!]
    platformMetrics: [PlatformMetrics!]
    userGrowth: [UserGrowth!]
  }

  # Purchase Types
  type Purchase {
    id: ID!
    produce: Produce!
    buyer: User!
    seller: User!
    quantity: String!
    totalAmount: Float!
    purchaseDate: String!
    status: PurchaseStatus!
    deliveryDate: String
    trackingId: String
    rating: Int
    review: String
    blockchainTxId: String
  }

  enum PurchaseStatus {
    PROCESSING
    CONFIRMED
    IN_TRANSIT
    DELIVERED
    CANCELLED
  }

  # Dashboard Stats Types
  type DashboardStats {
    totalProduce: Int!
    availableProduce: Int!
    soldProduce: Int!
    totalEarnings: Float!
    thisMonthEarnings: Float!
    pendingPayments: Float!
    activePurchases: Int!
    totalPurchases: Int!
    thisMonthSpent: Float!
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
    # Farmer-specific fields
    aadhaarId: String
    landLocation: String
    typeOfProduce: String
    # Distributor/Retailer-specific fields
    gstin: String
    businessName: String
    contactPerson: String
    businessAddress: String
    licenseNumber: String
  }

  input UpdateProfileInput {
    username: String
    name: String
    organization: String
    location: String
    phone: String
    # Farmer-specific fields
    aadhaarId: String
    landLocation: String
    typeOfProduce: String
    # Distributor/Retailer-specific fields
    gstin: String
    businessName: String
    contactPerson: String
    businessAddress: String
    licenseNumber: String
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

  # Produce Input Types
  input ProduceInput {
    cropName: String!
    quantity: String!
    price: Float!
    unit: String!
    harvestDate: String!
    farmLocation: String!
    description: String
    quality: String!
    organic: Boolean = false
  }

  input ProduceFilter {
    cropName: String
    farmer: ID
    priceMin: Float
    priceMax: Float
    quality: String
    organic: Boolean
    status: ProduceStatus
    location: String
    search: String
  }

  input PurchaseInput {
    produceId: ID!
    quantity: String!
    deliveryAddress: String
    notes: String
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

    # === Produce Queries ===
    produce(filter: ProduceFilter, limit: Int = 20, offset: Int = 0): [Produce!]!
    produceById(id: ID!): Produce
    myProduce(status: ProduceStatus): [Produce!]!
    
    # === Purchase Queries ===
    purchases(limit: Int = 20, offset: Int = 0): [Purchase!]!
    myPurchases: [Purchase!]!
    mySales: [Purchase!]!
    
    # === Dashboard Queries ===
    dashboardStats: DashboardStats!

    # === Traceability Queries ===
    traceProduct(productId: String!, qrCode: String): TraceabilityData
    generateQRCode(productId: String!): QRCodeData!
    
    # === Transaction History Queries ===
    transactionHistory(
      userRole: UserRole!
      userId: ID
      filters: TransactionHistoryFilter
      limit: Int = 20
      offset: Int = 0
    ): [TransactionHistoryItem!]!
    
    # === Analytics Queries ===
    analyticsData(userRole: UserRole!, timeRange: String = "month"): AnalyticsData!

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

    # === Produce Mutations ===
    addProduce(input: ProduceInput!): Produce!
    updateProduce(id: ID!, input: ProduceInput!): Produce!
    deleteProduce(id: ID!): Boolean!
    updateProduceStatus(id: ID!, status: ProduceStatus!): Produce!
    
    # === Purchase Mutations ===
    createPurchase(input: PurchaseInput!): Purchase!
    updatePurchaseStatus(id: ID!, status: PurchaseStatus!): Purchase!
    ratePurchase(id: ID!, rating: Int!, review: String): Purchase!

    # === Traceability Mutations ===
    updateProductJourney(
      productId: String!
      stage: String!
      title: String!
      actor: String!
      location: String!
      description: String!
      details: String # JSON string
    ): TraceabilityData!

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
    # Product data fields
    farmerId: String
    cropType: String
    quantity: String
    unit: String
    location: String
    quality: String
    customData: String
    processType: String
    sourceDataId: String
    inputQuantity: String
    outputQuantity: String
    outputProduct: String
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

  input TransactionHistoryFilter {
    dateRange: String
    status: TransactionHistoryStatus
    type: TransactionType
    minAmount: Float
    maxAmount: Float
    search: String
  }

  # File upload scalar
  scalar Upload
`;

module.exports = typeDefs;