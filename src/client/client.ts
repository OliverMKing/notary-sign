import {DownloadNotation} from './notation/download'
import {Client} from '../constants'

export interface INotarySigner {
   sign: () => void
}

export async function EnsureNotarySigner(
   type: Client,
   version: string
): Promise<INotarySigner> {
   switch (type) {
      case Client.Notation:
         await DownloadNotation(version)
         return {sign: () => console.log('hello')}
      default:
         throw Error(`No client implemented for type ${type}`)
   }
}
