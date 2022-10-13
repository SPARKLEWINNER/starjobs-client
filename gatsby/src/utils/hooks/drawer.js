import {useContext} from 'react'
import {CollapseDrawerContext} from 'contexts/DrawerContext'

const useCollapseDrawer = () => useContext(CollapseDrawerContext)

export default useCollapseDrawer
