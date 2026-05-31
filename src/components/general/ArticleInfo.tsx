//@ts-nocheck
import React, { useState } from 'react'
import { Box, Typography, Paper, Stack, Chip, Divider, IconButton, CircularProgress, Menu, MenuItem } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import { useGetData } from '@src/hooks/useGetData'
import { sizeConverter } from '@src/utility/sizeConverter'

const ArticleInfo = ({ articleID }) => {
   const [anchorEl, setAnchorEl] = useState(null)
   const open = Boolean(anchorEl)

   // Fetch article data when menu is opened
   const articleInfo = useGetData(open ? `api/Main/ArticleType/Info/${articleID}` : null, `article-info-${articleID}`, {
      ids: [articleID],
      enabled: open, // Only fetch when menu is open
   })

   const handleClick = (event) => {
      event.stopPropagation()
      setAnchorEl(event.currentTarget)
   }

   const handleClose = () => {
      setAnchorEl(null)
   }

   const article = articleInfo.data?.value

   return (
      <Box sx={{ display: 'inline-block' }}>
         {/* Info Icon Button */}
         <IconButton
            onClick={handleClick}
            size="small"
            sx={{
               color: 'primary.main',
               '&:hover': {
                  backgroundColor: 'bgColor.2',
               },
            }}
         >
            <InfoIcon fontSize="small" />
         </IconButton>

         {/* Info Menu */}
         <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
               sx: {
                  mt: 1,
                  p: sizeConverter(2, 'space'),
                  borderRadius: sizeConverter(8, 'radius'),
                  minWidth: sizeConverter(280, 'width'),
                  maxWidth: sizeConverter(350, 'width'),
                  maxHeight: sizeConverter(400, 'height'),
                  overflow: 'auto',
                  border: '1px solid',
                  borderColor: 'dataGrid.borderColor',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
               },
            }}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
         >
            <MenuItem onClick={(e) => e.stopPropagation()} sx={{ cursor: 'default' }}>
               {articleInfo.isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, width: '100%' }}>
                     <CircularProgress size={20} />
                  </Box>
               ) : article ? (
                  <Box sx={{ width: '100%' }}>
                     {/* Header */}
                     <Typography
                        variant="subHeader"
                        sx={{
                           color: 'black.1',
                           textAlign: 'right',
                           mb: 1,
                        }}
                     >
                        {article.articleName}
                     </Typography>

                     <Divider sx={{ mb: 1.5 }} />

                     {/* Status Chips */}
                     {/* <Stack direction="row" spacing={1} sx={{ mb: 2 }} justifyContent="flex-end">
                        <Chip
                           label={article.isActive ? 'فعال' : 'غیرفعال'}
                           color={article.isActive ? 'success' : 'default'}
                           size="small"
                           sx={{
                              fontFamily: 'yekanMedium',
                              fontSize: sizeConverter(10),
                           }}
                        />
                        <Chip
                           label={article.isProduct ? 'محصول' : 'مقاله'}
                           color="primary"
                           size="small"
                           sx={{
                              fontFamily: 'yekanMedium',
                              fontSize: sizeConverter(10),
                           }}
                        />
                     </Stack> */}

                     {/* Formulas Section */}
                     {article.isProduct && article.formulas && article.formulas.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                           <Typography
                              variant="normalBold"
                              sx={{
                                 color: 'black.1',
                                 textAlign: 'right',
                                 mb: 1,
                              }}
                           >
                              فرمول محصول:
                           </Typography>

                           <Stack spacing={1}>
                              {article.formulas.map((formula, index) => (
                                 <Box
                                    key={index}
                                    sx={{
                                       p: 1,
                                       bgcolor: 'bgColor.2',
                                       borderRadius: sizeConverter(4, 'radius'),
                                       border: '1px solid',
                                       borderColor: 'dataGrid.borderColor',
                                    }}
                                 >
                                    <Typography
                                       variant="normalBold"
                                       sx={{
                                          color: 'primary.main',
                                          textAlign: 'right',
                                          fontSize: sizeConverter(11),
                                       }}
                                    >
                                       {formula.faName}
                                    </Typography>
                                    <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ mt: 0.5 }}>
                                       <Typography variant="caption" sx={{ color: 'black.3', fontSize: sizeConverter(9) }}>
                                          مقدار: {formula.amount}
                                       </Typography>
                                       {formula.waterAmount > 0 && (
                                          <Typography variant="caption" sx={{ color: 'black.3', fontSize: sizeConverter(9) }}>
                                             آب: {formula.waterAmount}
                                          </Typography>
                                       )}
                                       {formula.rotation > 0 && (
                                          <Typography variant="caption" sx={{ color: 'black.3', fontSize: sizeConverter(9) }}>
                                             چرخش: {formula.rotation}
                                          </Typography>
                                       )}
                                    </Stack>
                                    {formula.cold && (
                                       <Typography
                                          variant="caption"
                                          sx={{
                                             color: 'primary.main',
                                             display: 'block',
                                             mt: 0.5,
                                             fontSize: sizeConverter(9),
                                          }}
                                       >
                                          فرآیند سرد
                                       </Typography>
                                    )}
                                 </Box>
                              ))}
                           </Stack>
                        </Box>
                     )}

                     {/* Users Section */}
                     <Box>
                        <Typography
                           variant="normalBold"
                           sx={{
                              color: 'black.1',
                              textAlign: 'right',
                              mb: 0.5,
                              fontSize: sizeConverter(11),
                              mx: sizeConverter(5, 'spaceX'),
                           }}
                        >
                           مالک :
                        </Typography>
                        <Typography
                           variant="normal"
                           sx={{
                              color: 'black.2',
                              textAlign: 'right',
                              p: 1,
                              bgcolor: 'bgColor.1',
                              borderRadius: sizeConverter(4, 'radius'),
                              fontSize: sizeConverter(11),
                           }}
                        >
                           {article.userName || article.exclusiveUsers || 'سیستم'}
                        </Typography>
                     </Box>
                  </Box>
               ) : (
                  <Typography
                     variant="normal"
                     sx={{
                        color: 'black.3',
                        textAlign: 'center',
                        p: 2,
                        width: '100%',
                     }}
                  >
                     اطلاعاتی یافت نشد
                  </Typography>
               )}
            </MenuItem>
         </Menu>
      </Box>
   )
}

export default ArticleInfo
