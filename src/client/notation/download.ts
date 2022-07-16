import {graphql} from '@octokit/graphql'
import {createActionAuth} from '@octokit/auth-action'
import * as core from '@actions/core'
import * as toolCache from '@actions/tool-cache'
import * as os from 'os'
import * as fs from 'fs'
import {
   AMD64,
   ARM64,
   LINUX,
   MAC_OS,
   TAR_GZ_EXTENSION,
   WINDOWS,
   ZIP_EXTENSION,
   LATEST_VERSION_STR
} from '../../constants'
import {extract} from '../../util/file'

const NOTATION_ORG = 'notaryproject'
const NOTATION_REPO = 'notation'
const SEMANTIC_VERSION_RE =
   /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
const DEFAULT_NOTATION_VERSION = 'v0.9.0-alpha.1'
const NOTATION_TOOL_NAME = 'notation'

/**
 * Downloads the specified notation version
 * @param version of notation. If 'latest' it gets the latest
 */
export async function DownloadNotation(version: string) {
   // set version if latest requested
   if (version.toLowerCase() === LATEST_VERSION_STR.toLowerCase()) {
      try {
         // in try catch because graphql had rate limit
         version = await getLatestVersion()
      } catch (err) {
         core.warning(
            `Couldn't find latest Notation version (error: ${err}). Defaulting to ${DEFAULT_NOTATION_VERSION}`
         )
         version = DEFAULT_NOTATION_VERSION
      }
   }

   // download
   core.startGroup(`Downloading notation version ${version}`)
   let cachedPath = toolCache.find(NOTATION_TOOL_NAME, version)
   if (!cachedPath) {
      core.debug(`${NOTATION_TOOL_NAME} not cached`)
      const url = getDownloadUrl(version)
      core.info('Downloading compressed')
      const downloadPath = await toolCache.downloadTool(url)
      core.info('Extracting from compressed')
      const extractedPath = await extract(downloadPath)
      cachedPath = await toolCache.cacheDir(
         extractedPath,
         NOTATION_TOOL_NAME,
         version
      )
   }
   fs.chmodSync(cachedPath, '755')
   core.endGroup()
}

/**
 * Returns the latest version of notation
 * @returns the latest version
 */
async function getLatestVersion(): Promise<string> {
   const auth = createActionAuth()
   const graphqlAuthenticated = graphql.defaults({request: {hook: auth.hook}})
   const {repository} = await graphqlAuthenticated(
      `
         {
            repository(name: "${NOTATION_REPO}", owner: "${NOTATION_ORG}") {
               releases(last: 100) {
                  nodes {
                     tagName
                  }
               }
            }
         }
      `
   )
   const releases = repository.releases.nodes.reverse()
   core.info(`releases: ${JSON.stringify(releases)}`)
   const latestValidRelease = releases.find(({tagName}) =>
      isValidVersion(tagName)
   )
   core.info(`latest releases: ${JSON.stringify(latestValidRelease)}`)
   return latestValidRelease.tagName
}

/**
 * checks if a version is valid
 * @param version
 * @returns boolean
 */
const isValidVersion = (version: string) => SEMANTIC_VERSION_RE.test(version)

/**
 * gets the download url for a version based on os and architecture
 * @param version
 * @returns download url
 */
function getDownloadUrl(version: string): string {
   const arch = os.arch()
   const operatingSystem = os.type()
   const compressExtension =
      operatingSystem == WINDOWS ? ZIP_EXTENSION : TAR_GZ_EXTENSION

   const getUrl = (os: string, architecture: string) =>
      `https://github.com/notaryproject/notation/releases/download/${version}/${version}_${os}_${architecture}.${compressExtension}`

   switch (true) {
      case operatingSystem == LINUX && arch == ARM64:
         return getUrl('linux', 'arm64')
      case operatingSystem == LINUX && arch == AMD64:
         return getUrl('linux', 'amd64')
      case operatingSystem == MAC_OS && arch == ARM64:
         return getUrl('darwin', 'arm64')
      case operatingSystem == MAC_OS && arch == AMD64:
         return getUrl('darwin', 'amd64')
      case operatingSystem == WINDOWS:
         return getUrl('windows', 'amd64')
   }

   throw Error(
      `No download url for Notary version ${version} on ${operatingSystem} ${arch}`
   )
}
