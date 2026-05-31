import {
    Control, FieldErrors,
    FieldValues, FormState,
    UseFormClearErrors,
    UseFormGetFieldState,
    UseFormGetValues, UseFormHandleSubmit, UseFormRegister, UseFormReset, UseFormResetField,
    UseFormSetError, UseFormSetFocus, UseFormSetValue, UseFormTrigger, UseFormUnregister,
    UseFormWatch
} from "react-hook-form";


export type formTypes<
    TFieldValues extends FieldValues = FieldValues,
    TContext = unknown
> = {
    watch?: UseFormWatch<TFieldValues>
    getValues?: UseFormGetValues<TFieldValues>
    getFieldState?: UseFormGetFieldState<TFieldValues>
    setError?: UseFormSetError<TFieldValues>
    clearErrors?: UseFormClearErrors<TFieldValues>
    setValue?: UseFormSetValue<TFieldValues>
    errors?: FieldErrors<TFieldValues> | undefined 
    trigger?: UseFormTrigger<TFieldValues>
    formState?: FormState<TFieldValues>
    resetField?: UseFormResetField<TFieldValues>
    reset?: UseFormReset<TFieldValues>
    handleSubmit?: UseFormHandleSubmit<TFieldValues>
    unregister?: UseFormUnregister<TFieldValues>
    control?: Control<TFieldValues, TContext>
    register?: UseFormRegister<TFieldValues>
    setFocus?: UseFormSetFocus<TFieldValues>
}
