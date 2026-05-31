// import { FC, useEffect } from 'react'
// import Grid from '@mui/material/Grid2'
// import Typography from '@mui/material/Typography'

// import { sizeConverter } from '@src/utility/sizeConverter'
// import TextFieldComp, { TextFieldCompProps } from '@components/general/hookFromInputs/TextFieldComp'
// import AutoCompleteComp from '@components/general/hookFromInputs/AutoComplete.tsx'
// import { Divider } from '@mui/material'
// import { useGetData } from '@src/hooks/useGetData'

// type FactorDetailCreationProps = {
//    conditionValue: any
//    setValue: any
// } & TextFieldCompProps

// export type Ingredient = {
//    id: 0,
//    enName: string,
//    faName: string,
//    deactive: boolean
// }[]

// const ArticleCustomDialog: FC<FactorDetailCreationProps> = ({ watch, register, conditionValue, setValue, errors, control }) => {

//    const IngredientList = useGetData<Ingredient>('api/Coffee/Ingredient/List', 'Ingredient-article')
//    //@ts-ignore
//    let productList = watch('ingredients')

//    useEffect(() => {
//       if (conditionValue?.actionKind === 'edit' &&
//          conditionValue?.article?.formulas?.length > 0 &&
//          !!IngredientList?.data?.value?.length
//       ) setValue('ingredients', IngredientList?.data?.value?.filter((p: Record<string, any>) => conditionValue?.article?.formulas?.some((s: any) => s.ingredientID === p.id))
//          .map((p: Record<string, any>) => {
//             const match = conditionValue?.article?.formulas?.find((s: any) => s.ingredientID === p.id);

//             setValue(`amount${p.id}`, match?.amount || 0);
//             setValue(`waterAmount${p.id}`, match?.waterAmount || 0);
//             setValue(`rotation${p.id}`, match?.rotation || 0);
//             return {
//                ...p,
//                name: p?.faName,
//             };
//          }))
//    }, [conditionValue?.article?.formulas, conditionValue?.actionKind, IngredientList?.data?.value])

//    return (
//       <Grid
//          container
//          size={12}
//          sx={{
//             borderWidth: sizeConverter(2),
//             borderStyle: 'solid',
//             borderColor: 'primary.main',
//             borderRadius: sizeConverter(5, 'radius'),
//             padding: sizeConverter(10, 'space'),
//             direction: 'rtl',
//             minHeight: sizeConverter(200, 'height'),
//          }}
//       >
//          <Grid
//             container
//             size={12}
//             justifyContent={'flex-end'}
//             alignItems={'center'}
//             spacing={sizeConverter(6, 'space')}
//             sx={{ mb: sizeConverter(10, 'spaceY') }}
//          >

//             <Grid size={12}>
//                <AutoCompleteComp
//                   label='مواد اولیه'
//                   value='ingredients'
//                   watch={watch}
//                   control={control}
//                   setValue={setValue}
//                   register={register}
//                   errors={errors}
//                   autocompleteType="multiple"
//                   //@ts-ignore
//                   autoCompleteOption={IngredientList?.data?.value?.map(item => ({ ...item, name: item?.faName })) || []}
//                   //@ts-ignore
//                   option={IngredientList?.data?.value || []}

//                />
//             </Grid>

//          </Grid>

//          <Grid size={12} sx={{ my: sizeConverter(10, 'spaceY') }}>
//             <Divider />
//          </Grid>

//          <Grid
//             container
//             size={12}
//             // direction="row"
//             gap={sizeConverter(10, 'spaceY')}
//             sx={{ maxHeight: sizeConverter(250, 'height'), overflowY: 'auto' }}
//          >
//             {

//                productList?.map((item: any) =>
//                   <Grid size={12} container justifyContent={'space-between'} alignItems={'center'} sx={{ direction: 'ltr', marginTop: sizeConverter(6, 'spaceY') }}>
//                      <Grid size={2}>
//                         <Typography variant="subtitle2">{item?.name}</Typography>
//                      </Grid>
//                      <Grid size={3.2}>
//                         <TextFieldComp
//                            label={'مقدار (گرم)'}
//                            value={`amount${item?.id}`}
//                            register={register}
//                            validators={{ required: 'لطفا مقدار وارد کنید' }}
//                            error={!!errors?.rePassword?.message}
//                         />
//                      </Grid>
//                      <Grid size={3.2}>
//                         <TextFieldComp
//                            label={'آب ( میلی لیتر)'}
//                            value={`waterAmount${item?.id}`}
//                            register={register}
//                            validators={{ required: 'لطفا مقدار وارد کنید' }}
//                            error={!!errors?.rePassword?.message}
//                         />
//                      </Grid>
//                      <Grid size={3.2}>

//                         <TextFieldComp
//                            label={'چرخش'}
//                            value={`rotation${item?.id}`}
//                            register={register}
//                            validators={{ required: 'لطفا مقدار وارد کنید' }}
//                            error={!!errors?.rePassword?.message}
//                         />
//                      </Grid>
//                   </Grid>
//                )}

//          </Grid>

//          {/* {articleDetailList.length === 0 && (
//             <Grid
//                container
//                size={12}
//                justifyContent="center"
//                alignItems="center"
//                sx={{ minHeight: sizeConverter(80), color: 'text.secondary' }}
//             >
//                <Typography variant="body2">هیچ جزئیاتی اضافه نشده است.</Typography>
//             </Grid>
//          )} */}
//       </Grid >
//    )
// }

// export default ArticleCustomDialog

// import { FC, useEffect } from 'react'
// import Grid from '@mui/material/Grid2'
// import Typography from '@mui/material/Typography'
// import { Divider, Button } from '@mui/material'
// import { useFieldArray } from 'react-hook-form'
// import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
// import { sizeConverter } from '@src/utility/sizeConverter'
// import TextFieldComp, { TextFieldCompProps } from '@components/general/hookFromInputs/TextFieldComp'
// import { useGetData } from '@src/hooks/useGetData'

// type FactorDetailCreationProps = {
//     conditionValue: any
//     setValue: any
// } & TextFieldCompProps

// export type Ingredient = {
//     id: number
//     enName: string
//     faName: string
//     deactive: boolean
// }[]

// const ArticleCustomDialog: FC<FactorDetailCreationProps> = ({
//     register,
//     conditionValue,
//     setValue,
//     errors,
//     control,
// }) => {
//     const IngredientList = useGetData<Ingredient>('api/Coffee/Ingredient/List', 'Ingredient-article')

//     const { fields, append, remove } = useFieldArray({
//         control,
//         name: 'ingredients',
//     })

//     const handleAddIngredient = (ingredient: any) => {
//         append({
//             id: ingredient?.id,
//             name: ingredient?.faName,
//             amount: '',
//             waterAmount: '',
//             rotation: '',
//         })
//     }

//     useEffect(() => {
//         if (
//             conditionValue?.actionKind === 'edit' &&
//             conditionValue?.article?.formulas?.length > 0 &&
//             !!IngredientList?.data?.value?.length
//         ) {
//             setValue('ingredients', [])
//             conditionValue?.article?.formulas?.forEach((f: any) => {
//                 const match = IngredientList?.data?.value?.find((p) => p?.id === f?.ingredientID)
//                 if (match) {
//                     append({
//                         id: match?.id,
//                         name: match?.faName,
//                         amount: f?.amount,
//                         waterAmount: f?.waterAmount,
//                         rotation: f?.rotation,
//                     })
//                 }
//             })
//         }
//     }, [conditionValue?.article?.formulas, conditionValue?.actionKind, IngredientList?.data?.value])

//     return (
//         <Grid
//             container
//             size={12}
//             sx={{
//                 borderWidth: sizeConverter(2),
//                 borderStyle: 'solid',
//                 borderColor: 'primary.main',
//                 borderRadius: sizeConverter(5, 'radius'),
//                 padding: sizeConverter(10, 'space'),
//                 direction: 'rtl',
//                 minHeight: sizeConverter(200, 'height'),
//             }}
//         >
//             <Grid container size={12} spacing={2} sx={{ cursor: 'pointer', mb: sizeConverter(10, 'spaceY'), display: 'flex', justifyContent: 'flex-end', }}>
//                 {IngredientList?.data?.value?.map((ingredient) => (
//                     <Grid size={3} key={ingredient?.id}>
//                         <Typography
//                             variant="subtitle2"
//                             onClick={() => handleAddIngredient(ingredient)}
//                             sx={{
//                                 border: (theme) => `1px solid ${theme.palette.divider}`,
//                                 borderRadius: sizeConverter(8, 'radius'),
//                                 textAlign: 'center',
//                                 py: sizeConverter(8, 'spaceY'),
//                                 px: sizeConverter(4, 'spaceX'),
//                                 cursor: 'pointer',
//                                 '&:hover': {
//                                     bgcolor: (theme) => theme.palette.action.hover,
//                                 },
//                             }}
//                         >
//                             {ingredient?.faName}
//                         </Typography>
//                     </Grid>
//                 ))}
//             </Grid>

//             <Grid size={12} sx={{ my: sizeConverter(10, 'spaceY') }}>
//                 <Divider />
//             </Grid>
//             <Grid
//                 container
//                 size={12}
//                 gap={sizeConverter(10, 'spaceY')}
//                 sx={{ maxHeight: sizeConverter(250, 'height'), overflowY: 'auto' }}
//             >
//                 {fields?.map((field, index) => (
//                     <Grid
//                         key={field?.id}
//                         size={12}
//                         container
//                         justifyContent={'space-between'}
//                         alignItems={'center'}
//                         sx={{ direction: 'ltr', marginTop: sizeConverter(6, 'spaceY') }}
//                     >
//                         <Grid size={2}>
//                             <Typography variant="subtitle2">{field?.name}</Typography>
//                         </Grid>

//                         <Grid size={2.5}>
//                             <TextFieldComp
//                                 label={'مقدار (گرم)'}
//                                 value={`ingredients.${index}.amount`}
//                                 register={register}
//                                 validators={{ required: 'لطفا مقدار وارد کنید' }}
//                                 error={!!errors?.ingredients?.[index]?.amount}
//                             />
//                         </Grid>

//                         <Grid size={2.5}>
//                             <TextFieldComp
//                                 label={'آب (میلی لیتر)'}
//                                 value={`ingredients.${index}.waterAmount`}
//                                 register={register}
//                                 validators={{ required: 'لطفا مقدار وارد کنید' }}
//                                 error={!!errors?.ingredients?.[index]?.waterAmount}
//                             />
//                         </Grid>

//                         <Grid size={3.2}>
//                             <TextFieldComp
//                                 label={'چرخش'}
//                                 value={`ingredients.${index}.rotation`}
//                                 register={register}
//                                 validators={{ required: 'لطفا مقدار وارد کنید' }}
//                                 error={!!errors?.ingredients?.[index]?.rotation}
//                             />
//                         </Grid>

//                         <Grid size={1}>
//                             <Button color="error" onClick={() => remove(index)}>
//                                 <DeleteRoundedIcon />
//                             </Button>
//                         </Grid>
//                     </Grid>
//                 ))}
//             </Grid>
//         </Grid >
//     )
// }

// export default ArticleCustomDialog
import { FC, useEffect } from 'react'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import { Divider, Button, IconButton, Alert } from '@mui/material'
import { useFieldArray, useWatch } from 'react-hook-form'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import AddIcon from '@mui/icons-material/Add'
import { sizeConverter } from '@src/utility/sizeConverter'
import TextFieldComp, { TextFieldCompProps } from '@components/general/hookFromInputs/TextFieldComp'
import { useGetData } from '@src/hooks/useGetData'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

type FactorDetailCreationProps = {
   conditionValue: any
   setValue: any
} & TextFieldCompProps

export type Ingredient = {
   id: number
   enName: string
   faName: string
   deactive: boolean
   name: string
}[]

const ArticleCustomDialog: FC<FactorDetailCreationProps> = ({ register, conditionValue, setValue, errors, control }) => {
   const IngredientList = useGetData<Ingredient>('api/Coffee/Ingredient/List', 'Ingredient-article')

   const { fields, append, remove, move } = useFieldArray({
      control,
      name: 'ingredients',
   })

   const ingredientsWaters = useWatch({
      control,
      name: 'ingredients',
   })

   const totalWaterAmount =
      ingredientsWaters?.map((item: any) => Number(item?.waterAmount) || 0).reduce((acc: number, curr: number) => acc + curr, 0) || 0

   const handleAddIngredient = (ingredient: any) => {
      append({
         id: ingredient?.id,
         name: ingredient?.faName,
         amount: '',
         waterAmount: '',
         rotation: '',
      })
   }

   useEffect(() => {
      if (conditionValue?.actionKind === 'edit' && conditionValue?.article?.formulas?.length > 0 && !!IngredientList?.data?.value?.length) {
         setValue('ingredients', [])
         conditionValue?.article?.formulas?.forEach((f: any) => {
            const match = IngredientList?.data?.value?.find((p) => p?.id === f?.ingredientID)
            if (match) {
               append({
                  id: match?.id,
                  name: match?.faName,
                  amount: f?.amount,
                  waterAmount: f?.waterAmount,
                  // rotation: f?.rotation,
                  rotation: 100,
               })
            }
         })
      }
   }, [conditionValue?.article?.formulas, conditionValue?.actionKind, IngredientList?.data?.value])

   const onDragEnd = (result: any) => {
      if (!result.destination) return
      move(result.source.index, result.destination.index)
   }

   return (
      <Grid
         container
         size={12}
         sx={{
            borderWidth: sizeConverter(2),
            borderStyle: 'solid',
            borderColor: 'primary.main',
            borderRadius: sizeConverter(5, 'radius'),
            padding: sizeConverter(10, 'space'),
            direction: 'rtl',
            minHeight: sizeConverter(200, 'height'),
         }}
      >
         <Grid
            container
            size={12}
            spacing={2}
            sx={{
               mb: sizeConverter(10, 'spaceY'),
               display: 'flex',
               flexWrap: 'wrap',
               justifyContent: 'flex-end',
            }}
         >
            {IngredientList?.data?.value?.map((ingredient) => (
               <Grid key={ingredient?.id} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                     variant="main"
                     endIcon={<AddIcon sx={{ pr: sizeConverter(4, 'spaceX') }} />}
                     onClick={() => handleAddIngredient(ingredient)}
                     sx={{
                        borderRadius: sizeConverter(8, 'radius'),
                        py: sizeConverter(4, 'spaceY'),
                     }}
                  >
                     {ingredient?.faName}
                  </Button>
               </Grid>
            ))}
         </Grid>

         <Grid size={12} sx={{ my: sizeConverter(10, 'spaceY') }}>
            <Divider />
         </Grid>

         {totalWaterAmount > 120 && (
            <Grid
               size={12}
               sx={{
                  mb: sizeConverter(10, 'spaceY'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
               }}
            >
               <Alert dir="rtl" severity="warning" sx={{ borderRadius: sizeConverter(8, 'radius') }}>
                  مجموع مقدار آب وارد شده نباید بیش از 120 میلی لیتر باشد
               </Alert>
            </Grid>
         )}

         <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="ingredients-droppable">
               {(provided) => (
                  <Grid
                     container
                     size={12}
                     gap={sizeConverter(10, 'spaceY')}
                     sx={{ maxHeight: sizeConverter(250, 'height'), overflowY: 'auto' }}
                     {...provided.droppableProps}
                     ref={provided.innerRef}
                  >
                     {fields?.map((field: Record<string, any>, index) => (
                        <Draggable key={field.id.toString()} draggableId={field.id.toString()} index={index}>
                           {(provided) => (
                              <Grid
                                 ref={provided.innerRef}
                                 size={12}
                                 container
                                 justifyContent={'space-between'}
                                 alignItems={'center'}
                                 sx={{
                                    direction: 'ltr',
                                    marginTop: sizeConverter(6, 'spaceY'),
                                    backgroundColor: 'background.paper',
                                    borderRadius: sizeConverter(2, 'radius'),
                                    boxShadow: 1,
                                    padding: sizeConverter(2, 'space'),
                                 }}
                                 {...provided.draggableProps}
                              >
                                 <Grid
                                    size={1}
                                    {...provided.dragHandleProps}
                                    sx={{
                                       cursor: 'grab',
                                       display: 'flex',
                                       justifyContent: 'center',
                                       alignItems: 'center',
                                       color: 'text.secondary',
                                       userSelect: 'none',
                                    }}
                                 >
                                    <IconButton size="small" aria-label="drag handle" edge="start">
                                       <DragIndicatorIcon />
                                    </IconButton>
                                 </Grid>

                                 <Grid size={2}>
                                    <Typography variant="subtitle2">{field?.name}</Typography>
                                 </Grid>

                                 <Grid size={3.5}>
                                    <TextFieldComp
                                       type="natural"
                                       label={'مقدار (گرم)'}
                                       value={`ingredients.${index}.amount`}
                                       register={register}
                                       validators={{ required: 'لطفا مقدار وارد کنید' }}
                                       error={!!errors?.ingredients?.[index]?.amount}
                                    />
                                 </Grid>

                                 <Grid size={3.5}>
                                    <TextFieldComp
                                       type="natural"
                                       label={'آب (میلی لیتر)'}
                                       value={`ingredients.${index}.waterAmount`}
                                       register={register}
                                       validators={{ required: 'لطفا مقدار وارد کنید' }}
                                       error={!!errors?.ingredients?.[index]?.waterAmount}
                                    />
                                 </Grid>

                                 {/* <Grid size={2.5}>
                                                <TextFieldComp
                                                    type='natural'
                                                    label={'چرخش'}
                                                    value={`ingredients.${index}.rotation`}
                                                    register={register}
                                                    validators={{ required: 'لطفا مقدار وارد کنید' }}
                                                    error={!!errors?.ingredients?.[index]?.rotation}
                                                />
                                            </Grid> */}

                                 <Grid size={1}>
                                    <Button color="error" onClick={() => remove(index)}>
                                       <DeleteRoundedIcon />
                                    </Button>
                                 </Grid>
                              </Grid>
                           )}
                        </Draggable>
                     ))}
                     {provided.placeholder}
                  </Grid>
               )}
            </Droppable>
         </DragDropContext>
      </Grid>
   )
}

export default ArticleCustomDialog
