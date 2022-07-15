import * as core from '@actions/core'
import {NOTATION} from './constants'

export const CLIENT_TYPE = core.getInput('clientType') || NOTATION
export const CLIENT_VERSION = core.getInput('version', {required: true})
