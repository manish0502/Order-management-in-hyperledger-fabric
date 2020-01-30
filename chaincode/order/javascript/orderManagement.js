const { Contract } = require('fabric-contract-api'); // extract Contract method from fabric-contract-api

class Order extends Contract {
    async init(ctx){
        console.log("chanicode is instantiated successfully!!!");
    }
    //Every func has min ctx as an argument
    async createOrder(ctx, order_id, product_name, qty, price) {
        const order = {
            order_id,
            product_name,
            qty,
            price,
            status: "new",
            docType: "order"  //to identify the type of data
        }

        try {
            const result = await ctx.stub.putState(order_id, Buffer.from(JSON.stringify(order)))
        } catch (error) {
            throw new Error('order creation failed');
        }


    }


    async getOrder(ctx, order_id) {
        const orderAsBytes = await ctx.stub.getState(order_id); // get the car from chaincode state
        if (!orderAsBytes || orderAsBytes.length === 0) {
            throw new Error(`${order_id} does not exist`);
        }
        console.log(orderAsBytes.toString());
        return orderAsBytes.toString();
    }

    // async getAllOrders(ctx){
    //     const startKey = 'Order1';
    //     const endKey = 'Order999';

    //     const iterator = await ctx.stub.getStateByRange(startKey, endKey);

    //     const allResults = [];
    //     while (true) {
    //         const res = await iterator.next();

    //         if (res.value && res.value.value.toString()) {
    //             console.log(res.value.value.toString('utf8'));

    //             const Key = res.value.key;
    //             let Record;
    //             try {
    //                 Record = JSON.parse(res.value.value.toString('utf8'));
    //             } catch (err) {
    //                 console.log(err);
    //                 Record = res.value.value.toString('utf8');
    //             }
    //             allResults.push({ Key, Record });
    //         }
    //         if (res.done) {
    //             console.log('end of data');
    //             await iterator.close();
    //             console.info(allResults);
    //             return JSON.stringify(allResults);
    //         }
    //     }
    // }

    async updateOrder(ctx, order_id, status) {
        console.info('============= START : Update Order ===========');

        const orderAsBytes = await ctx.stub.getState(order_id); // get the car from chaincode state
        if (!orderAsBytes || orderAsBytes.length === 0) {
            throw new Error(`${order_id} does not exist`);
        }
        const order = JSON.parse(orderAsBytes.toString());
        order.status = status;

        await ctx.stub.putState(order_id, Buffer.from(JSON.stringify(order)));
        console.info('============= END : Update Order ===========');

    }
}
module.exports = Order