import * as core from '@actions/core'
import {EnsureNotarySigner} from './client/client'
import {CLIENT_VERSION} from './inputs'
import {Client} from './constants'

export async function run() {
   const client = await EnsureNotarySigner(Client.Notation, CLIENT_VERSION)
   client.sign()
}

run().catch(core.setFailed)
