'use strict';

const { Contract } = require('fabric-contract-api');

class ProduceTraceabilityContract extends Contract {

    /**
     * Initialize the ledger with sample participants and produce
     */
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        
        // Sample participants
        const sampleParticipants = [
            {
                id: 'FARMER_001',
                participantType: 'Farmer',
                name: 'John Smith',
                farmName: 'Green Valley Farm',
                location: {
                    address: '123 Farm Road, Green Valley',
                    region: 'California',
                    country: 'USA'
                },
                certifications: ['Organic', 'Fair Trade'],
                verificationStatus: 'verified',
                isActive: true,
                docType: 'participant'
            },
            {
                id: 'DIST_001',
                participantType: 'Distributor',
                companyName: 'Fresh Express Distribution',
                licenseNumber: 'DIST2024001',
                serviceAreas: ['California', 'Nevada', 'Arizona'],
                verificationStatus: 'verified',
                isActive: true,
                docType: 'participant'
            },
            {
                id: 'RETAIL_001',
                participantType: 'Retailer',
                businessName: 'SuperFresh Market',
                businessType: 'supermarket',
                licenseNumber: 'RET2024001',
                verificationStatus: 'verified',
                isActive: true,
                docType: 'participant'
            }
        ];

        // Store participants
        for (const participant of sampleParticipants) {
            await ctx.stub.putState(participant.id, Buffer.from(JSON.stringify(participant)));
            console.info(`Added participant: ${participant.id}`);
        }

        // Sample produce
        const sampleProduce = [
            {
                produceId: 'PROD_001',
                batchNumber: 'GVF2024001',
                produceType: 'tomatoes',
                variety: 'Roma',
                origin: {
                    farmerId: 'FARMER_001',
                    farmName: 'Green Valley Farm',
                    harvestDate: '2025-09-15T08:00:00Z',
                    location: {
                        address: '123 Farm Road, Green Valley',
                        region: 'California',
                        country: 'USA'
                    }
                },
                quantity: {
                    amount: 500,
                    unit: 'kg',
                    packaging: {
                        type: 'crates',
                        material: 'wooden',
                        capacity: 25,
                        unit: 'kg'
                    }
                },
                quality: {
                    grade: 'A',
                    expiryDate: '2025-09-25T00:00:00Z'
                },
                currentOwner: {
                    participantId: 'FARMER_001',
                    participantType: 'Farmer',
                    ownershipDate: '2025-09-15T08:00:00Z'
                },
                priceHistory: [{
                    price: 2.50,
                    currency: 'USD',
                    priceType: 'farm-gate',
                    date: '2025-09-15T08:00:00Z',
                    participantId: 'FARMER_001'
                }],
                metadata: {
                    assetType: 'Produce',
                    createdDate: '2025-09-15T08:00:00Z',
                    status: 'active',
                    qrCodeGenerated: true,
                    qrCodeId: 'QR_PROD_001'
                },
                ownershipHistory: [],
                events: [{
                    eventType: 'created',
                    eventDate: '2025-09-15T08:00:00Z',
                    participantId: 'FARMER_001',
                    description: 'Produce batch created after harvest'
                }],
                docType: 'produce'
            }
        ];

        // Store produce
        for (const produce of sampleProduce) {
            await ctx.stub.putState(produce.produceId, Buffer.from(JSON.stringify(produce)));
            console.info(`Added produce: ${produce.produceId}`);
        }
        
        console.info('============= END : Initialize Ledger ===========');
        return 'Ledger initialized successfully with sample data';
    }

    /**
     * AddProduce: Farmer records new produce
     */
    async AddProduce(ctx, produceData) {
        console.info('============= START : Add Produce ===========');
        
        try {
            const data = JSON.parse(produceData);
            const farmerId = ctx.clientIdentity.getID();
            
            // Generate unique produce ID
            const timestamp = new Date().getTime();
            const produceId = `PROD_${timestamp}`;
            
            // Verify farmer exists (skip for demo)
            // const farmerExists = await this.participantExists(ctx, data.farmerId || farmerId);
            // if (!farmerExists) {
            //     throw new Error(`Farmer ${data.farmerId || farmerId} is not registered`);
            // }

            // Create produce asset
            const produce = {
                produceId: produceId,
                batchNumber: data.batchNumber || `BATCH_${timestamp}`,
                produceType: data.produceType,
                variety: data.variety || '',
                
                origin: {
                    farmerId: data.farmerId || farmerId,
                    farmName: data.farmName,
                    harvestDate: data.harvestDate || new Date().toISOString(),
                    location: data.location,
                    harvestMethod: data.harvestMethod || 'manual',
                    fieldConditions: data.fieldConditions || {}
                },
                
                quantity: {
                    amount: parseFloat(data.quantity.amount),
                    unit: data.quantity.unit,
                    packaging: data.packaging || {}
                },
                
                quality: {
                    grade: data.quality.grade || 'Standard',
                    appearance: data.quality.appearance || {},
                    expiryDate: data.quality.expiryDate,
                    storageRequirements: data.quality.storageRequirements || {}
                },
                
                currentOwner: {
                    participantId: data.farmerId || farmerId,
                    participantType: 'Farmer',
                    ownershipDate: new Date().toISOString(),
                    location: data.location ? data.location.address || '' : ''
                },
                
                priceHistory: [{
                    price: parseFloat(data.farmGatePrice || 0),
                    currency: data.currency || 'USD',
                    priceType: 'farm-gate',
                    date: new Date().toISOString(),
                    participantId: data.farmerId || farmerId
                }],
                
                ownershipHistory: [],
                
                certifications: data.certifications || [],
                treatments: data.treatments || [],
                
                metadata: {
                    assetType: 'Produce',
                    createdBy: farmerId,
                    createdDate: new Date().toISOString(),
                    lastModified: new Date().toISOString(),
                    version: 1,
                    status: 'active',
                    qrCodeGenerated: false,
                    qrCodeId: `QR_${produceId}`
                },
                
                events: [{
                    eventType: 'created',
                    eventDate: new Date().toISOString(),
                    participantId: data.farmerId || farmerId,
                    description: 'New produce batch registered on blockchain',
                    additionalData: {
                        harvestDate: data.harvestDate,
                        quantity: data.quantity
                    }
                }],
                
                consumerAccess: {
                    viewCount: 0,
                    lastViewed: null,
                    feedback: []
                },
                
                docType: 'produce'
            };

            // Store on blockchain
            await ctx.stub.putState(produceId, Buffer.from(JSON.stringify(produce)));
            
            // Emit event for frontend updates
            ctx.stub.setEvent('ProduceAdded', Buffer.from(JSON.stringify({
                produceId: produceId,
                farmerId: data.farmerId || farmerId,
                produceType: data.produceType,
                quantity: data.quantity,
                qrCodeId: `QR_${produceId}`,
                timestamp: new Date().toISOString()
            })));
            
            console.info(`Produce added: ${produceId}`);
            console.info('============= END : Add Produce ===========');
            
            return JSON.stringify({ 
                success: true, 
                produceId: produceId,
                qrCodeId: `QR_${produceId}`,
                message: 'Produce registered successfully'
            });
            
        } catch (error) {
            console.error(`Error adding produce: ${error.message}`);
            throw new Error(`Failed to add produce: ${error.message}`);
        }
    }

    /**
     * TransferOwnership: Distributor/retailer confirms receipt
     */
    async TransferOwnership(ctx, produceId, newOwnerId, transferDetails) {
        console.info('============= START : Transfer Ownership ===========');
        
        try {
            const details = JSON.parse(transferDetails);
            const currentParticipantId = ctx.clientIdentity.getID();
            
            // Get produce
            const produceAsBytes = await ctx.stub.getState(produceId);
            if (!produceAsBytes || produceAsBytes.length === 0) {
                throw new Error(`Produce ${produceId} does not exist`);
            }
            
            const produce = JSON.parse(produceAsBytes.toString());
            
            // Verify current owner (skip for demo)
            // if (produce.currentOwner.participantId !== currentParticipantId) {
            //     throw new Error(`Only current owner can transfer ownership`);
            // }
            
            // Record ownership transfer
            const transferRecord = {
                previousOwner: produce.currentOwner.participantId,
                newOwner: newOwnerId,
                transferDate: new Date().toISOString(),
                transferReason: details.reason || 'sale',
                transferPrice: parseFloat(details.price || 0),
                transferLocation: details.location || '',
                transportationDetails: details.transportation || {},
                documentsHash: details.documentsHash || ''
            };
            
            // Update ownership
            produce.ownershipHistory.push(transferRecord);
            produce.currentOwner = {
                participantId: newOwnerId,
                participantType: details.newOwnerType || 'Unknown',
                ownershipDate: new Date().toISOString(),
                location: details.location || ''
            };
            
            // Add price history if provided
            if (details.price) {
                produce.priceHistory.push({
                    price: parseFloat(details.price),
                    currency: details.currency || 'USD',
                    priceType: this.getPriceType(details.newOwnerType || 'Unknown'),
                    date: new Date().toISOString(),
                    participantId: newOwnerId,
                    marketLocation: details.location || ''
                });
            }
            
            // Add event
            produce.events.push({
                eventType: 'transferred',
                eventDate: new Date().toISOString(),
                participantId: currentParticipantId,
                description: `Ownership transferred to ${details.newOwnerType || 'participant'}`,
                additionalData: {
                    newOwner: newOwnerId,
                    transferPrice: details.price,
                    transferReason: details.reason
                }
            });
            
            // Update metadata
            produce.metadata.lastModified = new Date().toISOString();
            produce.metadata.version += 1;
            
            // Store updated produce
            await ctx.stub.putState(produceId, Buffer.from(JSON.stringify(produce)));
            
            // Emit event
            ctx.stub.setEvent('OwnershipTransferred', Buffer.from(JSON.stringify({
                produceId: produceId,
                previousOwner: transferRecord.previousOwner,
                newOwner: newOwnerId,
                newOwnerType: details.newOwnerType || 'Unknown',
                transferPrice: details.price,
                timestamp: new Date().toISOString()
            })));
            
            console.info(`Ownership transferred: ${produceId} -> ${newOwnerId}`);
            console.info('============= END : Transfer Ownership ===========');
            
            return JSON.stringify({
                success: true,
                message: 'Ownership transferred successfully',
                newOwner: newOwnerId
            });
            
        } catch (error) {
            console.error(`Error transferring ownership: ${error.message}`);
            throw new Error(`Failed to transfer ownership: ${error.message}`);
        }
    }

    /**
     * UpdateQuality: Records inspection results or spoilage
     */
    async UpdateQuality(ctx, produceId, qualityData) {
        console.info('============= START : Update Quality ===========');
        
        try {
            const data = JSON.parse(qualityData);
            const inspectorId = ctx.clientIdentity.getID();
            
            // Get produce
            const produceAsBytes = await ctx.stub.getState(produceId);
            if (!produceAsBytes || produceAsBytes.length === 0) {
                throw new Error(`Produce ${produceId} does not exist`);
            }
            
            const produce = JSON.parse(produceAsBytes.toString());
            
            // Create quality inspection record
            const inspection = {
                inspectionId: `INS_${new Date().getTime()}`,
                inspectorId: inspectorId,
                inspectionDate: new Date().toISOString(),
                inspectionType: data.inspectionType || 'routine',
                location: data.location || '',
                results: {
                    overallGrade: data.grade,
                    visualInspection: data.visualInspection || {},
                    laboratoryTests: data.laboratoryTests || [],
                    complianceChecks: data.complianceChecks || []
                },
                recommendations: data.recommendations || [],
                actionRequired: data.actionRequired || false
            };
            
            // Update produce quality
            if (data.grade) {
                produce.quality.grade = data.grade;
            }
            
            if (data.appearance) {
                produce.quality.appearance = { ...produce.quality.appearance, ...data.appearance };
            }
            
            if (data.testResults) {
                if (!produce.quality.testResults) {
                    produce.quality.testResults = [];
                }
                produce.quality.testResults.push(...data.testResults);
            }
            
            if (data.expiryDate) {
                produce.quality.expiryDate = data.expiryDate;
            }
            
            // Update status based on quality
            if (data.grade === 'F' || data.spoiled === true) {
                produce.metadata.status = 'spoiled';
            } else if (data.recalled === true) {
                produce.metadata.status = 'recalled';
            }
            
            // Add event
            produce.events.push({
                eventType: 'quality_updated',
                eventDate: new Date().toISOString(),
                participantId: inspectorId,
                description: `Quality inspection completed - Grade: ${data.grade}`,
                additionalData: {
                    inspectionType: data.inspectionType,
                    grade: data.grade,
                    actionRequired: data.actionRequired
                }
            });
            
            // Update metadata
            produce.metadata.lastModified = new Date().toISOString();
            produce.metadata.modifiedBy = inspectorId;
            produce.metadata.version += 1;
            
            // Store updated produce
            await ctx.stub.putState(produceId, Buffer.from(JSON.stringify(produce)));
            
            // Store inspection record separately
            await ctx.stub.putState(inspection.inspectionId, Buffer.from(JSON.stringify({
                ...inspection,
                produceId: produceId,
                docType: 'qualityInspection'
            })));
            
            // Emit event
            ctx.stub.setEvent('QualityUpdated', Buffer.from(JSON.stringify({
                produceId: produceId,
                inspectionId: inspection.inspectionId,
                grade: data.grade,
                status: produce.metadata.status,
                actionRequired: data.actionRequired,
                timestamp: new Date().toISOString()
            })));
            
            console.info(`Quality updated: ${produceId} - Grade: ${data.grade}`);
            console.info('============= END : Update Quality ===========');
            
            return JSON.stringify({
                success: true,
                message: 'Quality updated successfully',
                inspectionId: inspection.inspectionId,
                grade: data.grade
            });
            
        } catch (error) {
            console.error(`Error updating quality: ${error.message}`);
            throw new Error(`Failed to update quality: ${error.message}`);
        }
    }

    /**
     * TraceProduce: Query full produce history (for consumers)
     */
    async TraceProduce(ctx, produceId) {
        console.info('============= START : Trace Produce ===========');
        
        try {
            // Get produce
            const produceAsBytes = await ctx.stub.getState(produceId);
            if (!produceAsBytes || produceAsBytes.length === 0) {
                throw new Error(`Produce ${produceId} does not exist`);
            }
            
            const produce = JSON.parse(produceAsBytes.toString());
            
            // Update consumer access count
            if (!produce.consumerAccess) {
                produce.consumerAccess = { viewCount: 0, lastViewed: null, feedback: [] };
            }
            produce.consumerAccess.viewCount += 1;
            produce.consumerAccess.lastViewed = new Date().toISOString();
            
            // Store updated access data
            await ctx.stub.putState(produceId, Buffer.from(JSON.stringify(produce)));
            
            // Build comprehensive trace data
            const traceData = {
                produceInfo: {
                    id: produce.produceId,
                    batchNumber: produce.batchNumber,
                    type: produce.produceType,
                    variety: produce.variety,
                    status: produce.metadata.status,
                    qrCodeId: produce.metadata.qrCodeId
                },
                
                origin: produce.origin,
                
                currentStatus: {
                    owner: produce.currentOwner,
                    location: produce.currentOwner.location,
                    ownershipDate: produce.currentOwner.ownershipDate
                },
                
                supplyChain: produce.ownershipHistory,
                
                quality: {
                    currentGrade: produce.quality.grade,
                    appearance: produce.quality.appearance,
                    expiryDate: produce.quality.expiryDate,
                    testResults: produce.quality.testResults || []
                },
                
                pricing: {
                    currentPrice: produce.priceHistory[produce.priceHistory.length - 1] || null,
                    priceHistory: produce.priceHistory
                },
                
                certifications: produce.certifications || [],
                treatments: produce.treatments || [],
                
                timeline: produce.events.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate)),
                
                sustainability: {
                    carbonFootprint: this.calculateCarbonFootprint(produce),
                    foodMiles: this.calculateFoodMiles(produce),
                    organicCertified: (produce.certifications || []).some(cert => 
                        cert.type && cert.type.toLowerCase().includes('organic')
                    )
                },
                
                consumerAccess: produce.consumerAccess
            };
            
            // Emit trace event
            ctx.stub.setEvent('ProduceTraced', Buffer.from(JSON.stringify({
                produceId: produceId,
                tracedBy: 'consumer',
                timestamp: new Date().toISOString()
            })));
            
            console.info(`Produce traced: ${produceId}`);
            console.info('============= END : Trace Produce ===========');
            
            return JSON.stringify(traceData);
            
        } catch (error) {
            console.error(`Error tracing produce: ${error.message}`);
            throw new Error(`Failed to trace produce: ${error.message}`);
        }
    }

    /**
     * Register a new participant (Farmer, Distributor, Retailer)
     */
    async RegisterParticipant(ctx, participantData) {
        console.info('============= START : Register Participant ===========');
        
        try {
            const data = JSON.parse(participantData);
            const participantId = data.id || `${data.participantType.toUpperCase()}_${new Date().getTime()}`;
            
            const participant = {
                id: participantId,
                participantType: data.participantType,
                ...data,
                registrationDate: new Date().toISOString(),
                verificationStatus: 'pending',
                isActive: true,
                docType: 'participant'
            };
            
            await ctx.stub.putState(participantId, Buffer.from(JSON.stringify(participant)));
            
            // Emit event
            ctx.stub.setEvent('ParticipantRegistered', Buffer.from(JSON.stringify({
                participantId: participantId,
                participantType: data.participantType,
                timestamp: new Date().toISOString()
            })));
            
            console.info(`Participant registered: ${participantId}`);
            console.info('============= END : Register Participant ===========');
            
            return JSON.stringify({
                success: true,
                participantId: participantId,
                message: 'Participant registered successfully'
            });
            
        } catch (error) {
            console.error(`Error registering participant: ${error.message}`);
            throw new Error(`Failed to register participant: ${error.message}`);
        }
    }

    // Helper methods
    async participantExists(ctx, participantId) {
        const participantAsBytes = await ctx.stub.getState(participantId);
        return participantAsBytes && participantAsBytes.length > 0;
    }

    getPriceType(participantType) {
        switch (participantType) {
            case 'Farmer': return 'farm-gate';
            case 'Distributor': return 'wholesale';
            case 'Retailer': return 'retail';
            default: return 'market';
        }
    }

    calculateCarbonFootprint(produce) {
        // Simplified calculation - in reality would be more complex
        let footprint = 1.5; // Base footprint for production
        
        // Add transportation footprint
        produce.ownershipHistory.forEach(transfer => {
            if (transfer.transportationDetails && transfer.transportationDetails.method) {
                switch (transfer.transportationDetails.method) {
                    case 'truck': footprint += 0.5; break;
                    case 'rail': footprint += 0.2; break;
                    case 'air': footprint += 2.0; break;
                    case 'sea': footprint += 0.1; break;
                    default: footprint += 0.3;
                }
            }
        });
        
        return Math.round(footprint * 100) / 100;
    }

    calculateFoodMiles(produce) {
        // Simplified calculation
        let totalMiles = 0;
        
        produce.ownershipHistory.forEach(transfer => {
            // In reality, would calculate actual distance between locations
            totalMiles += 50; // Average 50 miles per transfer
        });
        
        return totalMiles;
    }
}

module.exports = ProduceTraceabilityContract;
