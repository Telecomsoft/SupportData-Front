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
   accessInfo: Record<string, { id: number; name: string; readAccess: boolean; writeAccess: boolean }> | null
   userType: number            // 1 staff, 2 supporter, 3 repairman, 4 contractor, 5 customer
   customerID: number | null   // set only for customer users
   personnelID: number | null  // set when the user is linked to a personnel record
}