import * as types from '../action/ActionTypes'

function initialState() {
  return {
    token: localStorage.getItem('user_token'),
    account: JSON.parse(localStorage.getItem('user_account')),
  }
}

function saveData(data){
  localStorage.setItem('user_token', data.token);
  localStorage.setItem('user_account', JSON.stringify(data.user_account  || {} ));
}


const userReducer = (state = initialState(), action) => {
  switch (action.type) {
    case types.UPDATE_LOGIN_DATA:
      saveData(action.loginData)
      return { ...action.loginData }
    default:
      return state
  }
}

export default userReducer