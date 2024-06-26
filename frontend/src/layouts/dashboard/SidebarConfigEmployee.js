import {Icon} from '@iconify/react'
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill'

const getIcon = (name) => <Icon icon={name} width={22} height={22} />
let _config = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  }
]

export default _config
