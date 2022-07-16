import * as fs from 'fs'
import * as toolCache from '@actions/tool-cache'
import * as path from 'path'
import * as os from 'os'
import {WINDOWS} from '../constants'

/**
 * extracts compressed files based on file extension
 * @param compressedPath path to compressed file
 * @returns path to extracted file
 */
export async function extract(compressedPath: string): Promise<string> {
   fs.chmodSync(compressedPath, '755')
   const extension = path.extname(compressedPath)
   switch (extension) {
      case '.zip':
         return toolCache.extractZip(compressedPath)
      case '.tar':
      case '.gz':
      default:
         return toolCache.extractTar(compressedPath)
   }
}

/**
 * Gets the executable extension based on os
 * @returns extension
 */
export function getExecutableExtension(): string {
   const operatingSystem = os.type()
   return operatingSystem == WINDOWS ? '.exe' : ''
}
