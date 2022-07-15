import * as core from '@actions/core'
import {EnsureNotarySigner} from './client/client'
import {CLIENT_TYPE, CLIENT_VERSION} from './inputs'

export async function run() {
   const client = await EnsureNotarySigner(CLIENT_TYPE, CLIENT_VERSION)
   client.sign()
}

run().catch(core.setFailed)
