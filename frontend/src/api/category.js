import request from 'utils/header'
const get_categories = () => request.get('/category');

const exp_object = {
    get_categories
}

export default exp_object;
