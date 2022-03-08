import { Icon } from '@iconify/react'
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill'
import peopleFill from '@iconify/icons-eva/people-fill'
import imageFill from '@iconify/icons-eva/image-outline'
import fileFill from '@iconify/icons-eva/file-text-outline'
import compassFill from '@iconify/icons-eva/compass-outline'

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />
let _config = [
  {
    title: 'dashboard',
    path: '/stores/app',
    icon: getIcon(pieChart2Fill),
  },
  {
    title: 'QR code',
    path: '/stores/qr',
    icon: getIcon(imageFill),
  },
  {
    title: 'user',
    path: '/stores/user',
    icon: getIcon(peopleFill),
  },
  {
    title: 'reports',
    path: '/stores/reports',
    icon: getIcon(fileFill),
  },
  {
    title: 'branches',
    path: '/stores/branches',
    icon: getIcon(compassFill),
  },
]

let _configWOBranch = [
  {
    title: 'dashboard',
    path: '/stores/app',
    icon: getIcon(pieChart2Fill),
  },
  {
    title: 'QR code',
    path: '/stores/qr',
    icon: getIcon(imageFill),
  },
  {
    title: 'user',
    path: '/stores/user',
    icon: getIcon(peopleFill),
  },
  {
    title: 'reports',
    path: '/stores/reports',
    icon: getIcon(fileFill),
  }
]

let exp_object = { _config, _configWOBranch }
export default exp_object
