'use strict';

const { Contract } = require('fabric-contract-api');

/**
 * AgriChain Smart Contract
 * Manages transparent agricultural data on the blockchain
 */
class AgriChainContract extends Contract {

    /**
     * Initialize the ledger with sample data
     */
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        
        const sampleData = [
            {
                id: 'DATA001',
                type: 'harvest',
                farmerId: 'FARMER001',
                cropType: 'wheat',
                quantity: '1000',
                unit: 'kg',
                harvestDate: '2025-09-15',
                location: 'Farm A, District 1',
                quality: 'Grade A',
                timestamp: new Date().toISOString(),
                verified: false
            },
            {
                id: 'DATA002', 
                type: 'processing',
                processorId: 'PROC001',
                sourceDataId: 'DATA001',
                processType: 'milling',
                inputQuantity: '1000',
                outputQuantity: '800',
                outputProduct: 'wheat_flour',
                processDate: '2025-09-16',
                timestamp: new Date().toISOString(),
                verified: false
            }
        ];

        for (let i = 0; i < sampleData.length; i++) {
            sampleData[i].docType = 'agriData';
            await ctx.stub.putState(sampleData[i].id, Buffer.from(JSON.stringify(sampleData[i])));
            console.info('Added <--> ', sampleData[i]);
        }
        
        console.info('============= END : Initialize Ledger ===========');
    }

    /**
     * Create new agricultural data entry
     */
    async createData(ctx, id, type, data) {
        console.info('============= START : Create Data ===========');

        const dataEntry = {
            id: id,
            type: type,
            ...JSON.parse(data),
            docType: 'agriData',
            timestamp: new Date().toISOString(),
            verified: false,
            createdBy: ctx.clientIdentity.getID()
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(dataEntry)));
        console.info('============= END : Create Data ===========');
        
        return JSON.stringify(dataEntry);
    }

    /**
     * Query data by ID
     */
    async queryData(ctx, id) {
        const dataAsBytes = await ctx.stub.getState(id);
        if (!dataAsBytes || dataAsBytes.length === 0) {
            throw new Error(`Data ${id} does not exist`);
        }
        console.log(dataAsBytes.toString());
        return dataAsBytes.toString();
    }

    /**
     * Query all agricultural data
     */
    async queryAllData(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value, 'utf8').toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    /**
     * Verify data entry (admin function)
     */
    async verifyData(ctx, id) {
        console.info('============= START : Verify Data ===========');

        const dataAsBytes = await ctx.stub.getState(id);
        if (!dataAsBytes || dataAsBytes.length === 0) {
            throw new Error(`Data ${id} does not exist`);
        }
        
        const dataEntry = JSON.parse(dataAsBytes.toString());
        dataEntry.verified = true;
        dataEntry.verifiedBy = ctx.clientIdentity.getID();
        dataEntry.verifiedAt = new Date().toISOString();

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(dataEntry)));
        console.info('============= END : Verify Data ===========');
        
        return JSON.stringify(dataEntry);
    }

    /**
     * Get data history
     */
    async getDataHistory(ctx, id) {
        let iterator = await ctx.stub.getHistoryForKey(id);
        let result = [];
        let res = await iterator.next();
        
        while (!res.done) {
            if (res.value) {
                console.info(`found state update with value: ${res.value.value.toString('utf8')}`);
                const obj = JSON.parse(res.value.value.toString('utf8'));
                result.push(obj);
            }
            res = await iterator.next();
        }
        
        await iterator.close();
        return JSON.stringify(result);
    }

    /**
     * Query data by type (harvest, processing, distribution, etc.)
     */
    async queryDataByType(ctx, type) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'agriData';
        queryString.selector.type = type;
        
        return await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
    }

    /**
     * Query data by farmer ID
     */
    async queryDataByFarmer(ctx, farmerId) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'agriData';
        queryString.selector.farmerId = farmerId;
        
        return await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
    }

    /**
     * Helper function for rich queries
     */
    async getQueryResultForQueryString(ctx, queryString) {
        let resultsIterator = await ctx.stub.getQueryResult(queryString);
        let results = await this.getAllResults(resultsIterator, false);
        
        return JSON.stringify(results);
    }

    /**
     * Helper function to get all results from iterator
     */
    async getAllResults(iterator, isHistory) {
        let allResults = [];
        let res = await iterator.next();
        
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));
                
                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.txId;
                    jsonRes.Timestamp = res.value.timestamp;
                    try {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString('utf8');
                    }
                } else {
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }
            res = await iterator.next();
        }
        
        iterator.close();
        return allResults;
    }

    /**
     * Update existing data (with history tracking)
     */
    async updateData(ctx, id, newData) {
        console.info('============= START : Update Data ===========');

        const dataAsBytes = await ctx.stub.getState(id);
        if (!dataAsBytes || dataAsBytes.length === 0) {
            throw new Error(`Data ${id} does not exist`);
        }

        const dataEntry = JSON.parse(dataAsBytes.toString());
        const updatedData = {
            ...dataEntry,
            ...JSON.parse(newData),
            lastModified: new Date().toISOString(),
            modifiedBy: ctx.clientIdentity.getID()
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedData)));
        console.info('============= END : Update Data ===========');
        
        return JSON.stringify(updatedData);
    }
}

module.exports = AgriChainContract;