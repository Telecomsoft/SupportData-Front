export type Device = {
    kioskSerial: string
    kioskName: string
    isConnected: boolean,
    detailSettings: DeviceDetailSetting[]
    syncTime: string
    changedProperties: string[]
}

export type DeviceDetailSetting = {
    settingName: string
    settingValue: string
    itemKind: string
}