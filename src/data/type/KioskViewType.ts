/* eslint-disable @typescript-eslint/no-explicit-any */


export type KioskViewType = {
    error: number
    errorMessage: string
    value: KioskView[]
}

export type KioskView = {
    id:                  number;
    kioskSerial:         string;
    kioskName:           string;
    pictureURL:          string | number | null;
    hardwareSerial:      string;
    branchCode:          string;
    branchName:          string | number | null;
    model:               string | number | null;
    version:             string | number | null;
    transactionType:     string | number | null;
    cardPan:             string | number | null;
    resultCode:          number;
    resultDesc:          string | number | null;
    transactionDate:     string | number | null;
    connectStatus:       boolean;
    ipAddress:           string | number | null;
    alarmList:           any[];
    counterList:         any[];
    ribbonCount:         number;
    cardPrinterAlarm:    number;
    cardReaderAlarm:     number;
    pinpadAlarm:         number;
    reseiptPrinterAlarm: number;
    barcodeAlarm:        number;
    webcamAlarm:         number;
    otherAlarm:          number;
}