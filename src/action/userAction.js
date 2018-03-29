import axios from 'axios';
import * as types from './ActionTypes'; 
import { Config } from '../const'
// 更新
const updateLoginData = (loginData) => ({type: types.UPDATE_LOGIN_DATA,loginData});


// 登陆
const fetchLogin = (data, callback) => (dispatch , getData) => {
  return axios.post(`${Config.server.back}/api/login`, data).then((res)=>res.data).then((json) => {
    callback && callback(json)
  }).catch((err) => {
    console.log(err)
  })
}

// 获取管理员信息
const fetchAdmin = (data, callback) => ( dispatch, getData ) => {
  axios.get('/api/admin',{
    params:data
  }).then((res) => res.data).then((json) => {
    callback && callback(json)
  }).catch((err) => {
    console.log(err)
  })
}


export default {
  fetchLogin,
  fetchAdmin 
}
