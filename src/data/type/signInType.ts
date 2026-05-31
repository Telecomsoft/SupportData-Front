export type signInType = {
   data: {
      error: number
      errorMessage: string
      value: Value
   }
}

export type Value = {
   token: string
   userName: string
   validaty: string
   refreshToken: null
   userID: number
   id: number
   userPicture: string
   roleID: number
   expiredTime: Date
   pictureURL: string
   accessInfo: null
}