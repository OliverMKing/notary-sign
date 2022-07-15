import * as fs from 'fs'
import * as toolCache from '@actions/tool-cache'
import * as path from 'path'

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
