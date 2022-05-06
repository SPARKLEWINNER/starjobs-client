import color from './palette'
export const LoadingButtonStyle = {
  backgroundColor: 'starjobs.main',
  borderColor: 'common.black',
  color: 'common.white',
  borderRadius: 1,
  boxShadow: `none !important`
}
export const LoadingButtonInvertedStyle = {
  backgroundColor: 'common.white',
  borderColor: 'common-white',
  color: 'common.black',
  borderRadius: 6
}

export const LoadingButtonOutline = {
  borderColor: `${color.common.white} !important`,
  color: 'starjobs.fieldLabel',
  fontWeight: 400,
  borderRadius: 6
}

export const DividerWhite = {
  my: 3,
  '&:after': {
    borderColor: 'common.black'
  },
  '&:before': {
    borderColor: 'common.black'
  }
}

export const InputOutlineStyle = {
  color: 'common.black',

  '& .MuiInputBase-formControl': {
    backgroundColor: color.starjobs.fieldColor
  },

  '& .MuiInputLabel-root ': {
    color: `${color.starjobs.fieldLabel} !important`
  },
  '& fieldset': {
    borderColor: `${color.starjobs.fieldColor} !important`
  },
  '& .Mui-error': {
    color: `${color.starjobs.main} !important`
  },
  '& input': {
    backgroundColor: color.starjobs.fieldColor,
    color: `${color.starjobs.main} !important`
  },
  '& .MuiFormHelperText-root': {
    color: `${color.starjobs.fieldLabel} !important`
  },
  '& .MuiOutlinedInput-root.Mui-focused': {
    color: `${color.starjobs.main} !important`,
    '& .MuiInputLabel-root ': {
      color: `${color.starjobs.fieldLabel} !important`
    },
    '& fieldset': {
      borderColor: `${color.starjobs.main} !important`
    },
    '& .Mui-error': {
      color: `${color.starjobs.fieldLabel} !important`
    }
  }
}

export const CheckboxWhiteStyle = {
  color: 'starjobs.fieldLabel',
  '& .MuiCheckbox-root svg': {
    width: '0.85em',
    height: '0.85em'
  },
  '& .MuiCheckbox-root svg path': {
    color: 'starjobs.fieldLabel'
  },
  '& .MuiTypography-root ': {
    fontSize: '0.75rem',
    fontWeight: '400'
  }
}
