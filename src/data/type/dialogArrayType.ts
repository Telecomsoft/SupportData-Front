/* eslint-disable @typescript-eslint/no-explicit-any */

import { ComponentType } from "react";
import { RegisterOptions } from "react-hook-form";

type option = {
    id: number;
    name: string
}

export type DialogArrayType = {
    label?: string
    value: string
    kind: 'combo' | 'textField' | 'checkbox' | 'uploadFile' | 'custom' | 'datePicker'
    type?: 'multiple' | 'number' | 'freeSolo' | 'name' | 'string' | 'searchable' | 'date' | 'password' | 'choice'
    options?: option[]
    disable?: boolean
    ltr?: boolean,
    validators?: RegisterOptions
    component?: ComponentType<any>
    [key: string]: unknown
}
