// import { Link } from "react-router-dom";
import { Box } from '@mui/material'
import { keyframes } from '@mui/material/styles'
// import logo from 'public/images/Vendinext.png'
// Infinite animations (pure CSS via MUI keyframes)
const scan = keyframes`
  0%   { transform: translateY(-120%); opacity: 0; }
  15%  { opacity: .7; }
  50%  { transform: translateY(0%);   opacity: .9; }
  85%  { opacity: .7; }
  100% { transform: translateY(120%);  opacity: 0; }
`

const subtlePulse = keyframes`
  0%   { transform: scale(1); }
  50%  { transform: scale(1.03); }
  100% { transform: scale(1); }
`

export default function HeaderLogo() {
   return (
      <Box
         sx={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            // mr: 1.25,
            // Gentle continuous pulse for the whole badge (optional, can remove)
            animation: `${subtlePulse} 5s ease-in-out infinite`,
         }}
      >
         {/* <Box
            component="img"
            src={logo}
            alt="Vendinext Logo"
            sx={{
               height: 40,
               width: 'auto',
               display: 'block',
               filter: 'drop-shadow(0 1px 1px rgba(0,0,0,.12))',
            }}
         /> */}
         {/* Scanning glow line (infinite) */}
         <Box
            aria-hidden
            sx={{
               pointerEvents: 'none',
               position: 'absolute',
               left: 0,
               top: 0,
               width: '100%',
               height: '100%',
               overflow: 'hidden',
               '::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  margin: '0 auto',
                  width: '100%',
                  height: '18%',
                  background: `linear-gradient(to bottom, rgba(255,255,255,.0), rgba(255,255,255,.9), rgba(255,255,255,.0))`,
                  filter: 'blur(2px)',
                  animation: `${scan} 3.6s linear infinite`,
               },
            }}
         />
      </Box>
   )
}
