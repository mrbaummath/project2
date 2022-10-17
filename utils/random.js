const axios = require('axios')
require('dotenv').config()


 const gaussPromise = (mean, sigma, n) => {
    const requestBody = {
        "jsonrpc": "2.0",
        "method": "generateGaussians",
        "params": {
            "apiKey": process.env.RANDOM_API_KEY,
            "n": n,
            "mean": mean,
            "standardDeviation": sigma,
            "significantDigits": Math.log10(mean) > 0 ? Math.floor(Math.log10(mean)) + 3: 3 ,
            "pregeneratedRandomization": null
        },
        "id": 14710
    }
    return axios.post('https://api.random.org/json-rpc/4/invoke', requestBody)
}

const processGauss = (dataArray) => {
    let processedData = dataArray.sort(function(a,b){return a - b})
    return processedData 
}

const binomPromise = (n) => {
    const requestBody = {
        "jsonrpc": "2.0",
        "method": "generateDecimalFractions",
        "params": {
            "apiKey": process.env.RANDOM_API_KEY,
            "n": n,
            "decimalPlaces": 8,
            "replacement": true
        },
        "id": 42
    }

    return axios.post('https://api.random.org/json-rpc/4/invoke', requestBody)

}

const processBinom = (percentP, decimalArray) => {
    const boolArray = decimalArray.map(decimal => (decimal <= percentP))
    return boolArray
}

//async function to use for testing purposes 
// async function getGauss() {
//     const response = await gaussPromise(10,6,9)
//     console.log(response.data.result.random.data)
// }

// getGauss()

//async function to use for testing purposes
// async function getDecimals() {
//     const response = await binomPromise(10)
//     console.log(response.data.result.random.data)
// }

// getDecimals()


module.exports = { gaussPromise, processGauss, binomPromise, processBinom }






