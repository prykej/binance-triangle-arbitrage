let binance = require('node-binance-api');

if (process.env.BINANCE_API_KEY && process.env.BINANCE_API_SECRET) {
    binance.options({
        APIKEY: process.env.BINANCE_API_KEY,
        APISECRET: process.env.BINANCE_API_SECRET,
        useServerTime: true,
        test: true
    });
}

let BinanceApi = {
    exchangeInfo() {
        console.log('Querying exchangeInfo');
        return new Promise((resolve, reject) => {
            binance.exchangeInfo((error, data) => {
                if (error) return reject(error);
                return resolve(data);
            });
        });
    },

    mockExchangeInfo(tickers) {
        let symbolObjects = tickers.map((ticker) => {return {'symbol': ticker}});
        return Promise.resolve({symbols: symbolObjects});
    },

    marketBuy(ticker, quantity) {
        return new Promise((resolve, reject) => {
            binance.marketBuy(ticker, quantity, (error, response) => {
                if (error) return reject(error);
                return resolve(response);
            })
        })
    },

    marketSell(ticker, quantity) {
        return new Promise((resolve, reject) => {
            binance.marketSell(ticker, quantity, (error, response) => {
                if (error) return reject(error);
                return resolve(response);
            });
        });
    },

    listenForUserData(balanceCallback, executionCallback) {
        return binance.websockets.userData(balanceCallback, executionCallback);
    },

    listenForDepth(tickers, callback) {
        if (typeof tickers === 'string') tickers = [tickers];
        return binance.websockets.depthCache(tickers, callback);
    },

    listenForDepthCache(tickers, callback) {
        console.log(`Opening depth websockets for ${tickers.length} tickers`);
        if (typeof tickers === 'string') tickers = [tickers];
        binance.websockets.depthCache(tickers, (symbol, depth) => {
            depth.bids = binance.sortBids(depth.bids);
            depth.asks = binance.sortAsks(depth.asks);
            callback(symbol, depth);
        });
    }
};

module.exports = BinanceApi;