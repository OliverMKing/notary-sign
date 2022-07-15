interface IClient {
   download: (version: string) => void
   signer: INotarySigner
}

interface INotarySigner {
   sign: () => void
}
