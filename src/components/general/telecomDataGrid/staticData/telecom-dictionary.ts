type LangProperty = {
    DataQuerying: string
    NODataToDisplay: string
    Search: string
    SearchInColumn: string
    PinToLeft: string
    PinToRight: string
    ColumnEdit: string
    ColumnStatus: string
    PersonalSetting: string
    RestPersonalSetting: string
    RestPin: string
    Sort: string
    Options: string
    ColumnSearchReset: string
    TotalCount: string
    SelectCount: string
    Cancel: string
    Save: string
    ColumnManager: string
    HiddenColumns: string
    VisibleColumns: string
    Export: string
    ExportCSV: string
    ExportPDF: string
    ExportExcel: string
    Of: string
    GroupBy: string
    GroupingReset: string
    Empty: string
    BorderInner: string
}

export const TELECOM_DICTIONARY: Record<'ENG' | 'FAR', LangProperty> = {
    ENG: {
        DataQuerying: 'Please Wait ...',
        NODataToDisplay: 'No Data to Display',
        Search: 'Search',
        SearchInColumn: 'Search in Column',
        PinToLeft: 'Pin to Left',
        PinToRight: 'Pin to Right',
        ColumnEdit: 'Column Arrangement',
        ColumnStatus: 'Column Status',
        PersonalSetting: 'Save Your Personal Setting (save every thing you changed in data grid) in this browser',
        RestPersonalSetting: 'Reset Personal Setting',
        RestPin: 'Reset Pin',
        Sort: 'Sort',
        Options: 'Options',
        ColumnSearchReset: 'Reset Column Search',
        GroupingReset: 'Reset Grouping',
        TotalCount: 'Total : ',
        SelectCount: 'Select Count : ',
        Cancel: 'Cancel',
        Save: 'Close',
        ColumnManager: 'Column Manager',
        HiddenColumns: 'Hidden Columns',
        VisibleColumns: 'Visible Columns',
        Export: 'Export',
        ExportCSV: 'Export as CSV',
        ExportPDF: 'Export as PDF',
        ExportExcel: 'Export as Excel',
        Of: 'of',
        GroupBy: 'Grouping in column',
        Empty: 'Empty',
        BorderInner: 'Border Inner in Cell',
    },
    FAR: {
        DataQuerying: 'لطفا منتظر بمانید ...',
        NODataToDisplay: 'اطلاعاتی برای نمایش وجود ندارد',
        Search: 'جستجو',
        SearchInColumn: 'جستجو در ستون',
        PinToLeft: 'سنجاق به چپ',
        PinToRight: 'سنجاق به راست',
        ColumnEdit: 'تغییر در نمایش ستون ها',
        ColumnStatus: 'دیدن وضعیت ستون ها',
        PersonalSetting: 'دخیره تغییرات اعمال شده روی جدول در این مرورگر',
        RestPersonalSetting: 'بازنشانی تمام تغییرات',
        RestPin: 'بازنشانی سنجاق',
        Sort: 'مرتب سازی',
        Options: 'گزینه ها',
        ColumnSearchReset: 'بازنشانی جستجو',
        GroupingReset: 'بازنشانی گروه بندی',
        TotalCount: 'تعداد : ',
        SelectCount: 'انتخاب شده : ',
        Cancel: 'انصراف',
        Save: 'بستن',
        ColumnManager: 'تغییر در نمایش و ترتیب ستون ها',
        HiddenColumns: 'ستون های پنهان',
        VisibleColumns: 'ستون های در حال نمایش',
        Export: 'خروجی',
        ExportCSV: 'خروجی CSV',
        ExportPDF: 'خروجی PDF',
        ExportExcel: 'خروجی Excel',
        Of: 'از',
        GroupBy: 'گروه بندی در ستون',
        Empty: 'خالی',
        BorderInner: 'خط بندی داخلی جدول',
    },
}
