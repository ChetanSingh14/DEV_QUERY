import * as api from '../api';
import { setcurrentuser } from './currentuser';
import { fetchallusers } from './users';

const handleAuthResponse = (data, dispatch, navigate) => {
    dispatch({ type: "AUTH", data });
    dispatch(setcurrentuser(JSON.parse(localStorage.getItem("Profile"))));
    dispatch(fetchallusers());
    navigate("/");
    return { success: true };
};
export const signup = (authdata, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signup(authdata);
        return handleAuthResponse(data, dispatch, navigate);
    } catch (error) {
        console.error(error);
        return { success: false, message: error.response?.data?.message || 'An error occurred during signup' };
    }
}
export const login = (authdata, navigate) => async (dispatch) => {
    try {
        const { data } = await api.login(authdata);
        return handleAuthResponse(data, dispatch, navigate);
    } catch (error) {
        console.error(error);
        return { success: false, message: error.response?.data?.message || 'An error occurred during login' };
    }
};

export const googleAuth = (tokenData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.googleAuth({
            name: tokenData.name,
            email: tokenData.email,
            picture: tokenData.picture
        });
        return handleAuthResponse(data, dispatch, navigate);
    } catch (error) {
        console.error(error);
        return { success: false, message: error.response?.data?.message || 'An error occurred during Google authentication' };
    }
};