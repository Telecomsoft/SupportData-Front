export type DataProps = {
    kioskSerial: string
    backupSwitchIP: number
    bssip: number
    bssPort: number
    backupSwitchPort: number
    merchantID1: number
    merchantID2: number
    terminalID1: number
    terminalID2: number
    backBSSPort: number
    backBSSIP: number
    switchPort: number
    switchIP: number
    serverPort: number
    serverIP: number
    backupServerPort: number
    backupServerIP: number
    fileServerPort: number
    fileServerIP: number
    backupFileServerPort: number
    backupFileServerIP: number
    isDirectSwitch: boolean
    dailyShutdownActive: boolean
    dailyShutdownTime: number
    dailyRestartActive: boolean
    dailyRestartTime: number
    dailyProgramRestartActive: boolean
    dailyProgramRestartTime: number
    isActive: boolean
    isButtonActive: boolean
    buttonNumber: number
    mainService: string
    getCardFirst: boolean
    getPinFirst: boolean
    getAccountFirst: boolean
    activeOnlyForThisBank: boolean
    ftpPassword: string
    ftpUsername: string
    needPrinter: boolean
    mustPrinter: boolean
}

export type SettingFields = {
    label: string
    key: keyof DataProps
    kind: string
    fieldType?: 'IP' | 'Port'
    size?: number
    type?: string
}

export const banksItem: SettingFields[] = [
    {
        label: 'BSS Port',
        key: 'bssPort',
        size: 2,
        fieldType: 'Port',
        kind: 'textField',
    },
    {
        label: 'BSS IP',
        key: 'bssip',
        size: 7,
        fieldType: 'IP',
        kind: 'IP',
    },
    {
        label: 'Back BSS Port',
        key: 'backBSSPort',
        size: 2,
        fieldType: 'Port',
        kind: 'textField',
    },
    {
        label: 'Back BSS IP',
        key: 'backBSSIP',
        size: 7,
        fieldType: 'IP',
        kind: 'IP',
    },
    {
        label: 'Switch Port',
        key: 'switchPort',
        size: 2,
        fieldType: 'Port',
        kind: 'textField',
    },
    {
        label: 'Switch IP ',
        key: 'switchIP',
        size: 7,
        fieldType: 'IP',
        kind: 'IP',
    },
    {
        label: 'Backup Switch Port',
        key: 'backupSwitchPort',
        size: 2,
        fieldType: 'Port',
        kind: 'textField',
    },
    {
        label: 'Backup Switch IP',
        key: 'backupSwitchIP',
        size: 7,
        fieldType: 'IP',
        kind: 'IP',
    },
    {
        label: 'BSS TerminalID1',
        key: 'terminalID1',
        fieldType: 'Port',
        kind: 'textField',
    },
    {
        label: 'BSS TerminalID2',
        key: 'terminalID2',
        fieldType: 'Port',
        kind: 'textField',
    },
    {
        label: 'BSS MerchantID1',
        key: 'merchantID1',
        fieldType: 'Port',
        kind: 'textField',
    },
    {
        label: 'BSS MerchantID2',
        key: 'merchantID2',
        fieldType: 'Port',
        kind: 'textField',
    },
    {
        label: 'Is Direct Switch',
        key: 'isDirectSwitch',
        fieldType: 'Port',
        kind: 'checkbox',
    },
]
export const serviceItem: SettingFields[] = [
    {
        label: 'isActive',
        key: 'isActive',
        size: 12,
        kind: 'checkbox',
    },
    {
        label: 'isButtonActive',
        key: 'isButtonActive',
        size: 12,
        kind: 'checkbox',
    },
    {
        label: 'buttonNumber',
        key: 'buttonNumber',
        size: 12,
        kind: 'textField',
    },
    {
        label: 'mainService',
        key: 'mainService',
        size: 12,
        kind: 'textField',
    },
    {
        label: 'getCardFirst',
        key: 'getCardFirst',
        size: 12,
        kind: 'checkbox',
    },
    {
        label: 'getPinFirst',
        key: 'getPinFirst',
        size: 12,
        kind: 'checkbox',
    },
    {
        label: 'getAccountFirst',
        key: 'getAccountFirst',
        size: 12,
        kind: 'checkbox',
    },
    {
        label: 'activeOnlyForThisBank',
        key: 'activeOnlyForThisBank',
        size: 12,
        kind: 'checkbox',
    },
    {
        label: 'needPrinter',
        key: 'needPrinter',
        size: 12,
        kind: 'checkbox',
    },
    {
        label: 'mustPrinter',
        key: 'mustPrinter',
        size: 12,
        kind: 'checkbox',
    },
]

export const mainenanceItems: SettingFields[] = [
    {
        label: 'Daily Shutdown Active',
        key: 'dailyShutdownActive',
        size: 6,
        type: 'check',
        kind: 'checkbox',
    },
    {
        label: 'Daily Shutdown Time',
        key: 'dailyShutdownTime',
        size: 6,
        type: 'textField',
        kind: 'textField',
    },
    {
        label: 'Daily Restart Active',
        key: 'dailyRestartActive',
        size: 6,
        type: 'check',
        kind: 'checkbox',
    },
    {
        label: 'Daily Restart Time',
        key: 'dailyRestartTime',
        size: 6,
        type: 'textField',
        kind: 'textField',
    },
    {
        label: 'Daily Program Restart Active',
        key: 'dailyProgramRestartActive',
        size: 6,
        type: 'check',
        kind: 'checkbox',
    },
    {
        label: 'Daily Program Restart Time',
        key: 'dailyProgramRestartTime',
        size: 6,
        type: 'textField',
        kind: 'textField',
    },
]

export const networkItems: SettingFields[] = [
    { label: 'Server Port', key: 'serverPort', fieldType: 'Port', kind: 'textField', size: 2 },
    { label: 'Server IP', key: 'serverIP', fieldType: 'IP', kind: 'IP', size: 7 },
    { label: 'Backup Server Port', key: 'backupServerPort', fieldType: 'Port', kind: 'textField', size: 2 },
    { label: 'Backup Server IP', key: 'backupServerIP', fieldType: 'IP', kind: 'IP', size: 7 },
    { label: 'File Server Port', key: 'fileServerPort', fieldType: 'Port', kind: 'textField', size: 2 },
    { label: 'File Server IP', key: 'fileServerIP', fieldType: 'IP', kind: 'IP', size: 7 },
    { label: 'Backup File Server Port', key: 'backupFileServerPort', fieldType: 'Port', kind: 'textField', size: 2 },
    { label: 'Backup File Server IP', key: 'backupFileServerIP', fieldType: 'IP', kind: 'IP', size: 7 },
    { label: 'FTP Username', key: 'ftpUsername', fieldType: 'Port', kind: 'textField', size: 7 },
    { label: 'FTP Password', key: 'ftpPassword', fieldType: 'Port', kind: 'textField', size: 7 },
]
