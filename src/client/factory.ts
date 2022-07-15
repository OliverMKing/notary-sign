import {DownloadNotation} from './notation/download'

export function GetClient(type: string): IClient {
   switch (type) {
      case 'notary':
         return {
            download: DownloadNotation,
            signer: {sign: () => console.log('hello')}
         }
   }

   throw Error(`No client implemented for type ${type}`)
}
