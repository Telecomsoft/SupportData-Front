/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'

/**
 * Shows another field only when a condition on the form is true. GeneralDialog has no "visible if" option, so a field
 * that depends on another is declared like this in the dialog array:
 *
 *   { label: 'مشتری', value: 'customerID', kind: 'combo', type: 'choice',
 *     component: ConditionalField, inner: AutoCompleteComp, showWhen: (v) => v.userType?.id === 5 }
 *
 * `kind` and `type` stay those of the real field (the dialog uses them to fill and read the value).
 * When the field is hidden its value is cleared, so a stale value is never sent.
 */
const ConditionalField = (props: any) => {
    const { item, watch, setValue } = props
    const Inner = item.inner
    const visible = !!item.showWhen?.(watch?.() ?? {})

    useEffect(() => {
        if (!visible) setValue?.(item.value, undefined)
    }, [visible])

    return visible ? <Inner {...props} /> : null
}

export default ConditionalField