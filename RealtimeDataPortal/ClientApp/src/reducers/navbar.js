const initialState = {
    configMode: false,
    adminMode: false,
    isOpenNavbar: true,
    updateNavbar: true
};

const navbar = (state = initialState, action) => {
    switch (action.type) {
        case 'TOOGLE_CONFIG_MODE':
            return {
                ...state,
                configMode: !state.configMode
            }
        case 'TOOGLE_ADMIN_MODE':
            return {
                ...state,
                adminMode: !state.adminMode
            }
        case 'TOOGLE_NAVBAR_STATE':
            return {
                ...state,
                isOpenNavbar: !state.isOpenNavbar
            }
        case 'UPDATE_NAVBAR':
            return {
                ...state,
                updateNavbar: !state.updateNavbar
            }
        default:
            return state;
    }
};

export default navbar;