import * as core from '@actions/core'

export const CLIENT_VERSION = core.getInput('version', {required: true})
