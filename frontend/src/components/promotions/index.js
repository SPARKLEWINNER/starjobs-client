import {useState, forwardRef} from 'react'
import Carousel from 'nuka-carousel'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Slide,
} from '@material-ui/core'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const PromotionsBanner = ({banners}) => {
  const [selected, setSelected] = useState(undefined)
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
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
                    objectFit: 'cover',
                  }}
                  src={banner.image}
                  alt={banner.title}
                  // onClick={() =>  {}}}
                />
              </Box>
            )
          })}
      </Carousel>
      {selected && (
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{'Do you wish to proceed with this action?'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Once action processed you may not be able to retrieve the data.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              No
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default PromotionsBanner
