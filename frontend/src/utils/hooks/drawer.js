import {useContext} from 'react'
import {CollapseDrawerContext} from '../context/drawer'

const useCollapseDrawer = () => useContext(CollapseDrawerContext)

export default useCollapseDrawer
