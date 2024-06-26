import {motion} from 'framer-motion'
// material
import {styled} from '@mui/material/styles'
import {Box} from '@mui/material'

import Logo from 'src/components/Logo'
import color from 'src/theme/palette'
import {useEffect} from 'react'

import {useNavigate} from 'react-router'

const RootStyle = styled('div')(({theme}) => ({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.starjobs?.main
}))

// variants for framer motion
const sentence = {
  hidden: {
    opacity: 1
  },
  visible: {
    transition: {
      opacity: 1,
      delay: 0.5,
      staggerChildren: 0.05
    }
  }
}

const letter = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1
  }
}

const titleLine1 = 'Connect. Engage. Accelerate'
export default function SplashScreen({...other}) {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/dashboard', {replace: true})
    // eslint-disable-next-line
  }, [])

  return (
    <RootStyle {...other}>
      <Box>
        <motion.div
          key={1}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{
            duration: 0.5,
            ease: 'easeInOut'
          }}
        >
          <Logo sx={{width: 140, height: 140, mx: 'auto', mb: 1}} />
        </motion.div>

        <motion.div key={2} initial="hidden" animate="visible" variants={sentence}>
          {titleLine1.split(' ').map((word, index) => (
            <>
              <span key={word + '-' + index} style={{display: 'inline-block'}}>
                {word.split('').map((char, index) => (
                  <motion.span
                    key={char + '-' + index}
                    variants={letter}
                    style={{
                      display: 'inline-block',
                      color: color.common.white
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
              <span key="44"> </span>
            </>
          ))}
        </motion.div>
      </Box>
    </RootStyle>
  )
}
