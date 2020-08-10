const core = require('@actions/core')
const axios = require('axios')

const api_url = core.getInput("api_url")
const api_key = core.getInput("api_key")

const rescale = axios.create({
    baseURL: `https://${api_url}/api/v3/`,
    headers: { Authorization: `Token ${api_key}` },
})

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
    })
    let id = create.data.id
    core.info(`Job ${id} created`)

    let submit = await rescale.post(`jobs/${id}/submit/`)
    core.info(`Job ${id} submitted ${submit.status}`)
    return id
}
job()
