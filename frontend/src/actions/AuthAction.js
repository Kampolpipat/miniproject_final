import * as AuthApi from '../api/AuthRequest'

export const logIn = (formData) => async (dispatch) => {
    dispatch({ type: "AUTH_START" })
    try {
        const { data } = await AuthApi.logIn(formData)
        dispatch({ type: "AUTH_SUCCESS", data: data })
    } catch (error) {
        console.log(error)
        const message = error?.response?.data?.message || error?.message || 'Authentication failed. กรุณาลองใหม่อีกครั้ง'
        dispatch({ type: "AUTH_FAIL", data: message })
    }
}

export const signUp = (formData) => async (dispatch) => {
    dispatch({ type: "AUTH_START" })
    try {
        const { data } = await AuthApi.signUp(formData)
        dispatch({ type: "AUTH_SUCCESS", data: data })
    } catch (error) {
        console.log(error)
        const message = error?.response?.data?.message || error?.message || 'Authentication failed. กรุณาลองใหม่อีกครั้ง'
        dispatch({ type: "AUTH_FAIL", data: message })
    }
}