import React, { useState, useEffect } from 'react'
import { Skeleton } from '@mui/material'
import Grid from '@mui/material/Grid2'
import SvgComponent from '@utility/SvgComponent'
import Logo from 'src/components/general/Logo'
import { sizeConverter } from '@utility/sizeConverter'
import getEndpoint from '@utility/getEndPoint.ts'

const ImageComponent = ({
   src,
   alt,
   height,
   width,
   onClick,
   imageStyle,
   borderRadius,
}: {
   src: string | null
   alt: string
   height?: number
   width?: number
   onClick?: () => void
   imageStyle?: React.CSSProperties
   borderRadius?: number | string
}) => {
   const [loading, setLoading] = useState(true)
   const [loadError, setLoadError] = useState(false)

   const handleImageLoad = () => {
      setLoading(false)
   }

   const handleImageError = () => {
      setLoading(false)
      setLoadError(true)
   }

   useEffect(() => {
      if (!src) {
         setLoading(false)
         setLoadError(true)
      } else {
         setLoading(true)
         setLoadError(false)
         // Create a new Image object to preload the image
         const img = new Image()
         img.src = getEndpoint() + src
         img.onload = handleImageLoad
         img.onerror = handleImageError
      }
   }, [src])

   return (
      <Grid
         container
         onClick={onClick}
         justifyContent="center"
         alignItems="center"
         size="grow"
         sx={{
            width: width,
            height: height,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: borderRadius || sizeConverter(6, 'radius'),
            ...(loadError && {
               borderWidth: sizeConverter(1),
               borderStyle: 'solid',
               borderColor: 'black.7',
               bgcolor: 'white.0',
            }),
         }}
      >
         {loading && (
            <Skeleton
               variant="rectangular"
               width={width}
               height={height}
               animation="wave"
               sx={{ position: 'absolute', top: 0, zIndex: 2 }}
            />
         )}
         {src && !loadError && (
            <img
               style={{
                  display: loading ? 'none' : 'block',
                  zIndex: 0,
                  objectFit: 'contain',
                  ...imageStyle,
               }}
               src={getEndpoint() + src}
               alt={alt}
               width={width}
               height={height}
               loading="lazy"
            />
         )}
         {!loading && loadError && (
            <SvgComponent
               style={{ padding: sizeConverter(6, 'space') }}
               height={0.9 * (height || 0)}
               width={0.9 * (width || 0)}
               icon={Logo}
               color={'#fff'}
            />
         )}
      </Grid>
   )
}

export default ImageComponent
