import { createFileRoute } from '@tanstack/react-router'
import { withSnackbar } from '@components/hoc/withSnackbar'
import { snackbarOpenType } from '@type/snackbarOpen'
import { DialogArrayType } from '@type/dialogArrayType'
import { TelecomColumnsType } from '@components/general/telecomDataGrid/staticData/TelecomDataGridType'
import GeneralCrudPage from '@components/general/GeneralCrudPage'
import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp'
import { REQUIRED_VALIDATOR } from '@src/data/validators/validators'
import { sizeConverter } from '@utility/sizeConverter'
import { useDevice } from '@hooks/useDevice'

export const Route = createFileRoute('/(baseData)/provincesList')({
    component: withSnackbar(ProvincesList),
    staticData: { breadcrumb: 'استان‌ها' },
})

function ProvincesList({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
    const { isMobile } = useDevice()

    const dialogArray: DialogArrayType[] = [
        { label: 'نام استان', value: 'name', kind: 'textField', size: isMobile ? 12 : 5.9, component: TextFieldComp, validators: { ...REQUIRED_VALIDATOR } },
    ]
    const columns: TelecomColumnsType[] = [{ field: 'name', headerName: 'نام استان', width: sizeConverter(220, 'width') }]

    return (
        <GeneralCrudPage
            title="استان"
            queryKey="list-provinces"
            listEndpoint="api/Location/ListProvinces"
            createEndpoint="api/Location/AddProvince"
            updateEndpoint="api/Location/UpdateProvince"
            deleteEndpoint="api/Location/DeleteProvince/"
            accessID={106}
            columns={columns}
            dialogArray={dialogArray}
            cardTitle={(r) => r.name}
            deleteDescription={(r) => `آیا از حذف استان ${r.name} اطمینان دارید؟`}
            snackbarOpen={snackbarOpen}
        />
    )
}