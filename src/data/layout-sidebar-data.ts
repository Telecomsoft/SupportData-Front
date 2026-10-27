/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, SVGProps } from 'react'
import { SvgIconComponent } from '@mui/icons-material'
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications'
import SupervisedUserCircleRoundedIcon from '@mui/icons-material/SupervisedUserCircleRounded'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import MemoryIcon from '@mui/icons-material/Memory';
import ComputerIcon from '@mui/icons-material/Computer';
import StorageIcon from '@mui/icons-material/Storage'
import BuildIcon from '@mui/icons-material/Build'
import EventBusyIcon from '@mui/icons-material/EventBusy'
import MapIcon from '@mui/icons-material/Map'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import BusinessIcon from '@mui/icons-material/Business'
import GroupsIcon from '@mui/icons-material/Groups'
import DescriptionIcon from '@mui/icons-material/Description'
import HandshakeIcon from '@mui/icons-material/Handshake'

export type DataType = {
   name: string
   value: string
   link?: string
   icon: ComponentType<SVGProps<SVGSVGElement>> | SvgIconComponent | string | any
   accessID?: number | number[]
   mobileLink?: string
}

export const LAYOUT_SIDEBAR_DATA: (DataType & { children?: DataType[] })[] = [
   {
      name: 'لیست خطا ها',
      value: 'errorsList',
      link: '/errorsList',
      icon: ReportProblemIcon,
      accessID: 105,
      children: [],
   },
   {
      name: 'تنظیمات',
      value: 'devicesList',
      mobileLink: '/mobileListSettings',
      icon: SettingsIcon,
      accessID: [104, 103],
      children: [
         {
            name: 'لیست  نوع قطعات ',
            value: 'devicesList',
            link: '/devicesList',
            icon: ComputerIcon,
            accessID: 104,
         },
         {
            name: 'لیست مدل قطعات ',
            value: 'deviceModelsList',
            link: '/deviceModelsList',
            icon: MemoryIcon,
            accessID: 104,
         },
         {
            name: 'لیست بانک ها ',
            value: 'banksList',
            link: '/banksList',
            icon: AccountBalanceIcon,
            accessID: 103,
         }
      ],
   },
   {
      name: 'تنظیمات کاربران',
      value: 'systemSettings',
      mobileLink: '/mobileListSystemManagement',
      icon: SettingsApplicationsIcon,
      accessID: [101, 102],
      children: [
         {
            name: 'کاربران',
            value: 'users',
            link: '/users',
            icon: PeopleAltIcon,
            accessID: 101,
         },
         {
            name: 'نقش کاربران',
            value: 'permissions',
            link: '/permissions',
            icon: SupervisedUserCircleRoundedIcon,
            accessID: 102,
         },
      ],
   },
   {
      name: 'اطلاعات پایه',
      value: 'baseData',
      mobileLink: '/mobileListBaseData',
      icon: StorageIcon,
      accessID: 106,
      children: [
         { name: 'کارهای انجام‌شده', value: 'workItemsList', link: '/workItemsList', icon: BuildIcon, accessID: 106 },
         { name: 'تعطیلات رسمی', value: 'holidaysList', link: '/holidaysList', icon: EventBusyIcon, accessID: 106 },
         { name: 'استان‌ها', value: 'provincesList', link: '/provincesList', icon: MapIcon, accessID: 106 },
         { name: 'شهرها', value: 'citiesList', link: '/citiesList', icon: LocationCityIcon, accessID: 106 },
         { name: 'مدل‌های کیوسک', value: 'kioskModelsList', link: '/kioskModelsList', icon: PointOfSaleIcon, accessID: 106 },
      ],
   },
   {
      name: 'مشتریان و قراردادها',
      value: 'customers',
      mobileLink: '/mobileListCustomers',
      icon: HandshakeIcon,
      accessID: [107, 108, 109],
      children: [
         { name: 'مشتریان', value: 'customersList', link: '/customersList', icon: BusinessIcon, accessID: 107 },
         { name: 'پرسنل', value: 'personnelList', link: '/personnelList', icon: GroupsIcon, accessID: 108 },
         { name: 'قراردادها', value: 'contractsList', link: '/contractsList', icon: DescriptionIcon, accessID: 109 },
      ],
   },
]