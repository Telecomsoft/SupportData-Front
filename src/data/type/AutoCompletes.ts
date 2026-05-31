
export type AutoCompleteOption = {
    id: number|string;
    name: string;
};

export interface AutoCompleteT {
    isMultiple?: boolean;
    isFreeSolo?: boolean;
    options: AutoCompleteOption[];
    handleOnChange: 'basic' | 'custom';
    getOptionLabel?: (option: AutoCompleteOption) => string;
    isOptionEqualToValue?: (option: AutoCompleteOption, value: AutoCompleteOption) => boolean;
    renderTags?: (value: AutoCompleteOption[]) => any
    onInputChange?:( newValue:string)=>void
}


export interface AutoCompleteObjectT {
    single: AutoCompleteT;
    multiple: AutoCompleteT;
    freeSolo: AutoCompleteT;
    searchable: AutoCompleteT;
}