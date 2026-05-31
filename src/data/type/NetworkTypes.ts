export interface KioskData {
    kioskSerial?: string
    kioskName?: string
    pictureURL?: null | string
    hardwareSerial?: string
    model?: null | string
    city?: string
    region?: string
    address?: string
    branchCode?: string
    supportName?: string
    supportTel?: string
    installationDate?: Date
    transactionType?: null | string
    cardSerial?: null | string
    resultCode?: number
    resultDesc?: null | string
    transactionTime?: Date | null
    showTransactionTime?: null | string
}
