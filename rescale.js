const core = require('@actions/core')
const axios = require('axios')

const api_url = core.getInput("api_url")
const api_key = core.getInput("api_key")

module.exports = axios.create({
    baseURL: `https://${api_url}/api/v3/`,
    headers: { Authorization: `Token ${api_key}` },
})