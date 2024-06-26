import Slider from 'react-slick'
import PropTypes from 'prop-types'
import {useRef} from 'react'
// material
import {useTheme, styled} from '@mui/material/styles'
import {Box} from '@mui/material'
// utils
//
import {CarouselControlsPaging2, CarouselControlsArrowsBasic2} from './controls'

import faker from 'faker'
const MOCK_CAROUSELS = [...Array(5)].map((_, index) => ({
  id: faker.datatype.uuid(),
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  image: faker.image.nature()
}))

const RootStyle = styled('div')(({theme}) => ({
  position: 'relative',
  '& .slick-list': {
    boxShadow: theme.customShadows.z16,
    borderRadius: theme.shape.borderRadiusMd
  }
}))

CarouselItem.propTypes = {
  item: PropTypes.object
}

function CarouselItem({item}) {
  const {image, title} = item

  return <Box component="img" alt={title} src={image} sx={{width: '100%', height: 480, objectFit: 'cover'}} />
}

export default function CarouselBasic3() {
  const theme = useTheme()
  const carouselRef = useRef()

  const settings = {
    dots: true,
    arrows: false,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    ...CarouselControlsPaging2({
      sx: {mt: 3}
    })
  }

  const handlePrevious = () => {
    carouselRef.current.slickPrev()
  }

  const handleNext = () => {
    carouselRef.current.slickNext()
  }

  return (
    <RootStyle>
      <Slider ref={carouselRef} {...settings}>
        {MOCK_CAROUSELS.map((item) => (
          <CarouselItem key={item.title} item={item} />
        ))}
      </Slider>
      <CarouselControlsArrowsBasic2 onNext={handleNext} onPrevious={handlePrevious} />
    </RootStyle>
  )
}
