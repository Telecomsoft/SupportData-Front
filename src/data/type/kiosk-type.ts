export type KioskType = {
  id?: number
  kioskSerial: string
  kioskName: string
  rowCount: number
  isActive: boolean
  createdDatetime: string
  showCreatedDatetime: string
  supportPerson: string
  supportContact: string
  contactPerson: string
  vendorID: number
  registerActive: boolean
  ingeredientID?: number
  typeID?: number
}


export interface TArticle {
  articleID: number;
  articleName: string;
  articleTypeID: number;
  articleTypeName: string;
  isActive: boolean;
  pictureURL: null | string;
  disableMultiple: boolean;
  isProduct?: boolean
}


export interface TArticleType {
  articleTypeID: number;
  articleTypeName: string;
}



export interface TKiosk {
  kioskSerial: string;
  id: number;
  kioskName: string;
  rowCount: number;
  isActive: boolean;
  createdDatetime: null | string;
  showCreatedDatetime: null | string;
  supportPerson: null | string;
  supportContact: null | string;
  contactPerson: null | string;
  vendorID: number;
  registerActive: boolean;
}


export interface TFactorRow {
  factorID: number;
  factorNo: string;
  kioskSerial: string;
  kioskName: string;
  factorTypeID: number;
  factorDate: string;
  factorShowDate: string;
  userID: number;
  userName: string;
  factorDetails: null;
  id?: any
}


export interface TKioskRow {
  kioskSerial: string;
  rowID: number;
  floorID: number;
  articleTypeID: null | number;
  articleID: null | number;
  articleName: null | string;
  pictureURL: null | string;
  price: null | number;
  discount: null | number;
  isActive: boolean;
  userID: null | number;
  createdDatetime: null;
  createdShowDatetime: null;
  id: number
}

export interface UpdateInfo {
  id: number;
  updateName: string;
  version: string;
  setDate: string; // یا Date اگه تبدیل کنی
  effectDate: string; // یا Date
  fileURL: string;
  remark: string;
  assignToAllKiosks: boolean;
  kioskSerials: string[];
  isActive: boolean;
  preRequiredVersion: string;
  fileSign: string;
}


export interface ClientInfo {
  id: number;
  kioskSerial: string;
  kioskName: string;
  currentVersion: string;
  setVersion: string;
  isUpdated: boolean;
  updateDate: string; // یا Date اگه تبدیل بشه
}