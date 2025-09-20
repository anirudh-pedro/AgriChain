'use strict';

const { Contract } = require('fabric-contract-api');

class SimpleContract extends Contract {

    async init(ctx) {
        console.log('Chaincode instantiated');
        return 'Success';
    }

    async set(ctx, key, value) {
        await ctx.stub.putState(key, Buffer.from(value));
        return 'Success';
    }

    async get(ctx, key) {
        const value = await ctx.stub.getState(key);
        if (!value || value.length === 0) {
            throw new Error(`Key ${key} does not exist`);
        }
        return value.toString();
    }

    async ping(ctx) {
        return 'pong';
    }
}

module.exports = SimpleContract;