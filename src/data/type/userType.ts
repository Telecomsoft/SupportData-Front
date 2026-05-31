export type UserType = {
   error: number
   errorMessage: string
   value: User[]
}

export type User = {
   id?: number
   userID?: number
   username?: string
   password?: string
   name?: string
   family?: string
   mobile?: string
   accessTypeID?: number
   expireDate?: string
   active?: boolean
   userPicture?: string
   pictureURL?: string
   authenticatBySMS?: boolean
   authenticatByEmail?: boolean
   email?: string
   loginName?: string
}

export type Access = {
   accessTypeID: number
   accessTypeName: string
}

export type KioskType = {
   kioskSerial: string
   kioskName: string
   pictureURL: string
   hardwareSerial: string
   model: string
   city: string
   address: string
   branchCode: string
   supportName: string
   supportTel: string
   installationDate: string
   explanation: string
   transactionType: string
   cardSerial: string
   resultCode: number
   resultDesc: string
   transactionTime: string
   showTransactionTime: string
   typeID?: number
   ID?: number
}

export type BankTypes = {
   kioskSerial: string
   kioskName: string
   terminalID: string
   merchantID: string
   bssConnectionActive: boolean
   bssip: string
   bssPort: number
   switchIP: string
   switchPort: number
   isDirectSwitch: boolean
   syncTime: string
   changedProperties: string[]
}
