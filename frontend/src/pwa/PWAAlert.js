import {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import PropTypes from 'prop-types'

PWAAlert.propTypes = {
  text: PropTypes.string,
  buttonText: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func
}

const PWAAlert = ({text, buttonText, type, onClick}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!onClick) {
      const timer = setTimeout(() => {
        dispatch({type})
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <div className="alert">
      {text} {buttonText && <button onClick={onClick}>{buttonText}</button>}
    </div>
  )
}

export default PWAAlert
