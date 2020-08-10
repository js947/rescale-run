const core = require('@actions/core')
const axios = require('axios')

const api_url = core.getInput("api_url")
const api_key = core.getInput("api_key")

const rescale = axios.create({
    baseURL: `https://${api_url}/api/v3/`,
    headers: { Authorization: `Token ${api_key}` },
})

function handle(tag, cb) {
    return function(err) {
        try {
            let e = new Error(`${tag} response=${JSON.stringify(err.response.data)}`)
            throw e
        } catch (err) {
            let e = new Error(`${tag} err=${err}`) 
            throw e
        }
    }
}

async function job() {
    let create = await rescale.post("jobs/", {
        name: core.getInput("name"),
        jobanalyses: [{
            hardware: {
                coresPerSlot: parseInt(core.getInput("corecount")),
                coreType: { "code": core.getInput("coretype") },
                walltime: parseInt(core.getInput("walltime")),
            },
            analysis: {
                code: core.getInput("analysis"), 
                version: core.getInput("analysis_version"),
            },
            inputFiles: [],
            useRescaleLicense: false,
            userDefinedLicenseSettings: null,
        }],
    }).catch(handle("create"))
    let id = create.data.id
    core.info(`Job ${id} created`)

    let submit = await rescale.post(`jobs/${id}/submit/`, {
        foo: "foo", bar: "bar"
    }).catch(handle("submit"))
    core.info(`Job ${id} submitted ${submit.status}`)
    return id
}
job()
