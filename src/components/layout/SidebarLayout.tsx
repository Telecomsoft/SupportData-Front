// import { Typography } from '@mui/material'
// import Grid from '@mui/material/Grid2'
// import { sizeConverter } from '@utility/sizeConverter'
// import { Dispatch, SetStateAction, useMemo } from 'react'
// import { LAYOUT_SIDEBAR_DATA } from '@data/layout-sidebar-data'
// import TreeWrapper from '@components/general/tree/TreeWrapper'
// // import logo from 'public/images/Vendinextwhite.png'
// // import logoshort from 'public/images/Vendinextwhite-thick.png'
// import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
// type SidebarLayoutProp = {
//    setIsOpen: Dispatch<SetStateAction<boolean>>
//    isOpen: boolean
// }

// const SidebarLayout = ({ setIsOpen, isOpen }: SidebarLayoutProp) => {

//    const tree = useMemo(() => {
//       // var filtered = LAYOUT_SIDEBAR_DATA.map((item) => {
//       //    return { ...item, children: item.children?.filter((x) => permissions?.data?.value?.find((p) => p?.id == x.accessID)) }
//       // })
//       // const filtered = LAYOUT_SIDEBAR_DATA?.filter((item) => item.children?.length > 0)
//       return LAYOUT_SIDEBAR_DATA
//    }, [LAYOUT_SIDEBAR_DATA])


//    const handleToggleSidebar = () => {
//       setIsOpen((prev: boolean) => !prev)
//    }

//    return (
//       <Grid
//          container
//          size={12}
//          sx={{
//             bgcolor: 'primary.main',
//             height: 1,
//          }}
//       >
//          <Grid container size={12} sx={{ height: '100%' }} alignContent={'flex-start'} justifyContent={'center'}>
//             <Grid
//                container
//                size={12}
//                onClick={handleToggleSidebar}
//                justifyContent={'center'}
//                alignItems={'center'}
//                sx={{
//                   flexWrap: 'nowrap',
//                   height: '10%',
//                   cursor: 'pointer',
//                }}
//             >

//                {/* 
//                <SvgComponent
//                   width={sizeConverter(45)}
//                   height={sizeConverter(45)}
//                   icon={Vendinext}
//                   color={theme.palette.white['1']}
//                   style={{ marginLeft: sizeConverter(8) }}
//                /> */}
//                <Typography
//                variant={'header'}
//                   sx={{
//                      color: 'white.1',
//                      fontFamily: 'yekanBold',
//                      fontSize: sizeConverter(16),
//                   }}
//                ><Grid>
//                      <HeadsetMicIcon sx={{
//                         fontSize: sizeConverter(20),
//                      }} />
//                   </Grid>
//                   {isOpen ? 'KIOSK SUPPORT INFO ' : "K-S-I"}
//                </Typography>

//             </Grid>
//             <Grid
//                container
//                sx={{
//                   width: 1,
//                   height: sizeConverter(660, 'height'),
//                   color: 'white',
//                   overflowY: 'auto',
//                   overflowX: 'hidden',
//                }}
//             >
//                <Grid container alignContent={'flex-start'}>
//                   <TreeWrapper treeHeight={'auto'} data={tree} isFullWidth={isOpen} treeStyle={'layout'} childrenSink={true} />
//                </Grid>
//             </Grid>
//             <Grid container justifyContent={'center'} alignItems={'center'}>
//                {isOpen && (
//                   <Typography
//                      noWrap
//                      variant={'caption'}
//                      sx={{
//                         color: 'white.1',
//                         fontFamily: 'yekanBold',
//                         px: sizeConverter(6, 'space'),
//                         py: sizeConverter(12, 'space'),
//                      }}
//                   >
//                      Powered by Telecomsoft
//                   </Typography>
//                )}
//             </Grid>
//          </Grid>
//       </Grid>
//    )
// }

// export default SidebarLayout

import { Dispatch, SetStateAction, useMemo } from 'react';
import Grid from '@mui/material/Grid2';
import { Typography } from '@mui/material';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import { sizeConverter } from '@utility/sizeConverter';
import { LAYOUT_SIDEBAR_DATA } from '@data/layout-sidebar-data';
import TreeWrapper from '@components/general/tree/TreeWrapper';
import { useAccessCheck } from '@src/utility/accessCheck';

type SidebarLayoutProp = {
   setIsOpen: Dispatch<SetStateAction<boolean>>;
   isOpen: boolean;
};

const SidebarLayout = ({ setIsOpen, isOpen }: SidebarLayoutProp) => {
   const { accessCheck } = useAccessCheck();

   // تابع بررسی دسترسی برای یک آیتم (پشتیبانی از accessID: number | number[])
   const hasItemAccess = (item: any): boolean => {
      const accessId = item.accessID;
      if (accessId === undefined || accessId === null) return true; // بدون محدودیت

      if (Array.isArray(accessId)) {
         // شرط OR: حداقل یکی از accessIDها باید مجاز باشد
         return accessId.some((id: number) =>
            accessCheck({ accessInfoId: id, KindAccessInfo: 'readAccess' })
         );
      }
      // عدد تکی
      return accessCheck({ accessInfoId: accessId, KindAccessInfo: 'readAccess' });
   };

   const tree = useMemo(() => {
      return LAYOUT_SIDEBAR_DATA?.map((item) => {
         // فیلتر کردن فرزندان
         const filteredChildren = item.children?.filter((child) => hasItemAccess(child));
         return { ...item, children: filteredChildren };
      }).filter((item) => {
         const hasSelfAccess = hasItemAccess(item);
         const hasRemainingChildren = item.children && item.children.length > 0;
         return hasSelfAccess && (item.link || hasRemainingChildren);
      });
   }, [accessCheck]);

   return (
      <Grid container size={12} sx={{ bgcolor: 'primary.main', height: 1 }}>
         <Grid container size={12} sx={{ height: '100%' }} alignContent={'flex-start'} justifyContent={'center'}>
            <Grid container size={12} onClick={() => setIsOpen(p => !p)} justifyContent={'center'} alignItems={'center'} sx={{ flexWrap: 'nowrap', height: '10%', cursor: 'pointer' }}>
               <Typography variant={'header'} sx={{ color: 'white.1', fontFamily: 'yekanBold', fontSize: sizeConverter(16) }}>
                  <HeadsetMicIcon sx={{ fontSize: sizeConverter(20), mr: 1 }} />
                  {isOpen ? 'KIOSK SUPPORT INFO ' : ""}
               </Typography>
            </Grid>

            <Grid container sx={{ width: 1, height: sizeConverter(660, 'height'), color: 'white', overflowY: 'auto', overflowX: 'hidden' }}>
               <Grid container alignContent={'flex-start'}>
                  <TreeWrapper treeHeight={'auto'} data={tree} isFullWidth={isOpen} treeStyle={'layout'} childrenSink={true} />
               </Grid>
            </Grid>

            <Grid container justifyContent={'center'} alignItems={'center'}>
               {isOpen && (
                  <Typography noWrap variant={'caption'} sx={{ color: 'white.1', fontFamily: 'yekanBold', px: 2, py: 3 }}>
                     Powered by Telecomsoft
                  </Typography>
               )}
            </Grid>
         </Grid>
      </Grid>
   );
};

export default SidebarLayout;