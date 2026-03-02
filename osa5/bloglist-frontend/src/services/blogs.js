import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const remove = id => {
  const url = `${baseUrl}/${id}`
  const config = {
    headers: { Authorization: token }
  }
  const request = axios.delete(url, config)
  return request.then(response => response.data)
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const addLike = (id, newObject) => {
  const request =  axios.put(`${baseUrl}/${id}`, newObject)
  return request.then((response) => response.data)
}

export default { getAll, setToken, create, addLike, remove }