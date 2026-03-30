const authReducer = (
    state = { authData: null, loading: false, error: false, errorMessage: '' },
    action
) => {


    switch (action.type) {
        case "AUTH_START":
            return { ...state, loading: true, error: false, errorMessage: '' };
        case "AUTH_SUCCESS":
            // OWASP A3: Sensitive Data Exposure - ทิ้งเฉพาะ token และข้อมูล user ที่จำเป็นใน localStorage
            const payload = {
                user: action?.data?.user ?? null,
                token: action?.data?.token ?? null
            };
            localStorage.setItem("profile", JSON.stringify(payload));
            return { ...state, authData: payload, loading: false, error: false, errorMessage: '' };
        case "AUTH_FAIL":
            return { ...state, loading: false, error: true, errorMessage: action?.data || 'Authentication failed. กรุณาลองใหม่อีกครั้ง' };
        case "AUTH_LOGOUT":
            return { authData: null, loading: false, error: false, errorMessage: '' };
        case "AUTH_RESET_ERROR":
            return { ...state, error: false, errorMessage: '' };
        default:
            return state
    }
};

export default authReducer