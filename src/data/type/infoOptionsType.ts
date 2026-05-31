/* eslint-disable */

import { FunctionComponent } from 'react'
import { snackbarOpenType } from './snackbarOpen'
import { formTypes } from './reactHookFormType'

export type InfoOptionsProps = {
    value: string
    name: string
    type: string
}

export type Config = {
    value: string
    name: string
    component?: FunctionComponent<InfoOptionsProps>
    size: number
    type: string
}[]

export type infoOption = {
    config?: Config
    [key: string]: any
    snackbarOpen?: snackbarOpenType
    createEndpoint?: string
} & formTypes

export type GeneralInfoProps = {
    infoOptions?: infoOption
    height: number | string
    data?: any
    snackbarOpen?: snackbarOpenType
}
