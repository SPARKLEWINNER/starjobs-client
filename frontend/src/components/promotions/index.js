import {useState, forwardRef} from 'react'
import Carousel from 'nuka-carousel'
import {HighlightOff as HighlightOffIcon} from '@mui/icons-material'
import {Box, Dialog, DialogActions, DialogContent, Button, Slide} from '@mui/material'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const PromotionsBanner = ({banners}) => {
  const [selected, setSelected] = useState(undefined)
  const [selectedBanner, setSelectedBanner] = useState(null)

  const handleOpen = (bannerLink) => {
    setSelected(true)
    setSelectedBanner(bannerLink)
  }

  const handleClose = () => {
    setSelected(undefined)
  }

  return (
    <>
      <Carousel
        autoplay={true}
        withoutControls={true}
        wrapAround={true}
        cellSpacing={40}
        cellAlign={'center'}
        slidesToShow={1.5}
        transitionMode={'scroll3d'}
      >
        {banners &&
          banners.map((banner, key) => {
            return (
              <Box component="div" key={key}>
                <Box
                  component="img"
                  sx={{
                    width: '100%',
                    borderRadius: '15px',
                    objectFit: 'cover'
                  }}
                  src={banner.image}
                  alt={banner.title}
                  onClick={() => handleOpen(banner.image)}
                />
              </Box>
            )
          })}
      </Carousel>
      {selected && (
        <Dialog
          open={selected}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          sx={{overflow: 'hidden'}}
        >
          <DialogContent sx={{p: 0, height: '50vh', overflow: 'hidden'}}>
            <Box component="img" src={selectedBanner} sx={{height: '100%', width: '100%', objectFit: 'cover'}} />
          </DialogContent>
          <DialogActions
            sx={{
              mb: -10,
              textAlign: 'center',
              bgColor: 'rgba(255,255,255,0)',
              zIndex: 20,
              position: 'absolute',
              top: 0,
              right: -15
            }}
          >
            <Button onClick={handleClose} color="primary" sx={{mx: 'auto'}}>
              <HighlightOffIcon sx={{color: 'common.white', fontSize: 32}} />
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default PromotionsBanner
