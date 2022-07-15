import {DownloadNotation} from './notation/download'

export interface INotarySigner {
   sign: () => void
}

export async function EnsureNotarySigner(
   type: string,
   version: string
): Promise<INotarySigner> {
   switch (type) {
      case 'notary':
         await DownloadNotation(version)
         return {sign: () => console.log('hello')}
   }

   throw Error(`No client implemented for type ${type}`)
}
