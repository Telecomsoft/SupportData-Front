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
]