// AgriChain Asset and Participant Definitions
// =============================================

/**
 * PARTICIPANTS
 * ============
 */

// Farmer - Primary producer of agricultural goods
const FarmerParticipant = {
    participantType: 'Farmer',
    farmerId: 'string',        // Unique farmer identifier
    name: 'string',            // Farmer name
    farmName: 'string',        // Farm/Business name
    location: {                // Farm location
        address: 'string',
        coordinates: {
            latitude: 'number',
            longitude: 'number'
        },
        region: 'string',
        country: 'string'
    },
    certifications: ['string'], // Organic, Fair Trade, etc.
    contactInfo: {
        email: 'string',
        phone: 'string'
    },
    verificationStatus: 'string', // 'verified', 'pending', 'unverified'
    registrationDate: 'Date',
    isActive: 'boolean'
};

// Distributor - Handles transportation and wholesale
const DistributorParticipant = {
    participantType: 'Distributor',
    distributorId: 'string',   // Unique distributor identifier
    companyName: 'string',     // Distribution company name
    licenseNumber: 'string',   // Business license
    serviceAreas: ['string'],  // Geographic areas served
    transportationMethods: ['string'], // truck, rail, air, sea
    storageCapacity: {
        volume: 'number',
        units: 'string',       // cubic meters, tons, etc.
        refrigerated: 'boolean',
        temperatureRange: {
            min: 'number',
            max: 'number'
        }
    },
    contactInfo: {
        email: 'string',
        phone: 'string',
        address: 'string'
    },
    verificationStatus: 'string',
    registrationDate: 'Date',
    isActive: 'boolean'
};

// Retailer - Sells to end consumers
const RetailerParticipant = {
    participantType: 'Retailer',
    retailerId: 'string',      // Unique retailer identifier
    businessName: 'string',    // Store/business name
    businessType: 'string',    // supermarket, restaurant, market, etc.
    locations: [{              // Multiple store locations
        storeId: 'string',
        address: 'string',
        coordinates: {
            latitude: 'number',
            longitude: 'number'
        }
    }],
    licenseNumber: 'string',
    contactInfo: {
        email: 'string',
        phone: 'string'
    },
    verificationStatus: 'string',
    registrationDate: 'Date',
    isActive: 'boolean'
};

// Consumer - End user purchasing produce
const ConsumerParticipant = {
    participantType: 'Consumer',
    consumerId: 'string',      // Unique consumer identifier (optional)
    preferences: {
        organic: 'boolean',
        localProduce: 'boolean',
        sustainablePractices: 'boolean'
    },
    location: {                // General location for recommendations
        region: 'string',
        country: 'string'
    },
    registrationDate: 'Date'   // Optional registration
};

/**
 * ASSETS
 * ======
 */

// Primary Asset: Produce
const ProduceAsset = {
    // Core Identity
    produceId: 'string',       // Unique blockchain identifier (QR code links here)
    batchNumber: 'string',     // Batch/lot number for grouping
    produceType: 'string',     // tomatoes, apples, wheat, etc.
    variety: 'string',         // specific variety (Roma tomatoes, Gala apples)
    
    // Origin Information
    origin: {
        farmerId: 'string',    // Reference to farmer
        farmName: 'string',
        location: {
            address: 'string',
            coordinates: {
                latitude: 'number',
                longitude: 'number'
            },
            region: 'string',
            country: 'string'
        },
        harvestDate: 'Date',
        harvestMethod: 'string', // manual, mechanical
        fieldConditions: {
            weather: 'string',
            soilType: 'string',
            irrigationMethod: 'string'
        }
    },
    
    // Quantity and Packaging
    quantity: {
        amount: 'number',
        unit: 'string',        // kg, tons, boxes, crates
        packaging: {
            type: 'string',    // boxes, bags, bulk
            material: 'string', // cardboard, plastic, biodegradable
            capacity: 'number',
            unit: 'string'
        }
    },
    
    // Quality Information
    quality: {
        grade: 'string',       // A, B, C or Premium, Standard, Economy
        appearance: {
            color: 'string',
            size: 'string',    // small, medium, large
            condition: 'string' // fresh, slightly damaged, etc.
        },
        nutritionalValue: {
            calories: 'number',
            vitamins: ['string'],
            minerals: ['string']
        },
        testResults: [{
            testType: 'string', // pesticide, heavy metals, bacteria
            result: 'string',   // pass, fail, within limits
            testDate: 'Date',
            laboratoryId: 'string'
        }],
        expiryDate: 'Date',
        storageRequirements: {
            temperature: {
                min: 'number',
                max: 'number',
                unit: 'string'
            },
            humidity: 'number',
            specialRequirements: ['string']
        }
    },
    
    // Pricing and Market Information
    priceHistory: [{
        price: 'number',
        currency: 'string',
        priceType: 'string',   // wholesale, retail, farm-gate
        date: 'Date',
        marketLocation: 'string',
        participantId: 'string' // who set this price
    }],
    
    // Ownership and Transfer Chain
    currentOwner: {
        participantId: 'string',
        participantType: 'string', // Farmer, Distributor, Retailer
        ownershipDate: 'Date',
        location: 'string'
    },
    
    ownershipHistory: [{
        previousOwner: 'string',
        newOwner: 'string',
        transferDate: 'Date',
        transferReason: 'string', // sale, transport, processing
        transferPrice: 'number',
        transferLocation: 'string',
        transportationDetails: {
            method: 'string',
            duration: 'number',
            conditions: 'string',
            trackingId: 'string'
        },
        documentsHash: 'string' // Hash of transfer documents
    }],
    
    // Certifications and Compliance
    certifications: [{
        type: 'string',        // Organic, Fair Trade, Non-GMO
        issuingBody: 'string',
        certificateNumber: 'string',
        issueDate: 'Date',
        expiryDate: 'Date',
        documentHash: 'string'
    }],
    
    // Processing and Treatment History
    treatments: [{
        treatmentType: 'string', // pesticide, fertilizer, processing
        substance: 'string',
        applicationDate: 'Date',
        applicator: 'string',
        dosage: 'string',
        waitingPeriod: 'number' // days before harvest/consumption
    }],
    
    // Blockchain Metadata
    metadata: {
        assetType: 'Produce',
        createdBy: 'string',
        createdDate: 'Date',
        lastModified: 'Date',
        modifiedBy: 'string',
        version: 'number',
        status: 'string',      // active, sold, expired, recalled
        qrCodeGenerated: 'boolean',
        qrCodeData: 'string'
    },
    
    // Events and Alerts
    events: [{
        eventType: 'string',   // created, transferred, quality_updated, recalled
        eventDate: 'Date',
        participantId: 'string',
        description: 'string',
        additionalData: 'object'
    }],
    
    // Consumer Interaction
    consumerAccess: {
        viewCount: 'number',
        lastViewed: 'Date',
        feedback: [{
            consumerId: 'string',
            rating: 'number',
            comment: 'string',
            date: 'Date'
        }]
    }
};

/**
 * SUPPORTING ASSETS
 * =================
 */

// Quality Inspection Records
const QualityInspectionAsset = {
    inspectionId: 'string',
    produceId: 'string',       // Reference to produce
    inspectorId: 'string',
    inspectionDate: 'Date',
    inspectionType: 'string',  // routine, complaint-based, regulatory
    location: 'string',
    results: {
        overallGrade: 'string',
        visualInspection: 'object',
        laboratoryTests: ['object'],
        complianceChecks: ['object']
    },
    recommendations: ['string'],
    actionRequired: 'boolean',
    documentHash: 'string'
};

// Transportation Records
const TransportationAsset = {
    shipmentId: 'string',
    produceIds: ['string'],    // Multiple produce items in shipment
    fromParticipantId: 'string',
    toParticipantId: 'string',
    route: {
        origin: 'object',
        destination: 'object',
        waypoints: ['object']
    },
    transportationDetails: {
        method: 'string',
        vehicleId: 'string',
        driverId: 'string',
        departureTime: 'Date',
        arrivalTime: 'Date',
        conditions: {
            temperature: ['object'], // time-series data
            humidity: ['object'],
            location: ['object']     // GPS tracking
        }
    },
    status: 'string',          // in-transit, delivered, delayed
    documentsHash: 'string'
};

module.exports = {
    participants: {
        FarmerParticipant,
        DistributorParticipant,
        RetailerParticipant,
        ConsumerParticipant
    },
    assets: {
        ProduceAsset,
        QualityInspectionAsset,
        TransportationAsset
    }
};