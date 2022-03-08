import request from 'utils/header'

const force_relog = () => request.get('/settings/relog');

const exp_object = {
    force_relog
}

export default exp_object;