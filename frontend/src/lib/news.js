import request from 'src/utils/header'
const BASE_URL = 'https://newsapi.org/v2/top-headlines?country=ph&q=vaccine&apiKey=21cab60eaa224701b688559c78053fb3'
const get_news = () => request.get(BASE_URL)

const exp_object = {
  get_news
}

export default exp_object
