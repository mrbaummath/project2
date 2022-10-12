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
            "significantDigits": 6,
            "pregeneratedRandomization": null
        },
        "id": 14710
    }
    return axios.post('https://api.random.org/json-rpc/4/invoke', requestBody)
}

//async function to use for testing purposes 
// async function callAxios() {
//     const response = await gaussPromise(10,6,9)
//     console.log(response.data.result.random.data)
// }

// callAxios()

const processGauss = (dataArray) => {
    let processedData = dataArray.sort(function(a,b){return a - b})
    return processedData 
}

module.exports = { gaussPromise, processGauss }






