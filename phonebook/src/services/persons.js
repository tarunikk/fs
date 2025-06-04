import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    return axios.get(baseUrl)
  }
  
const create = newObject => {
    return axios.post(baseUrl, newObject)
  }

export default { getAll, create }