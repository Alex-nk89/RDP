export const userInitialize = (user) => {
    return {
        type: 'USER_INITIALIZE',
        payload: user
    }
};

export const userFetching = () => {
    return {
        type: 'USER_FETCHING'
    }
};

export const userFetchingError = () => {
    return {
        type: 'USER_FETCHING_ERROR'
    }
};

export const toogleConfigMode = () => {
    return {
        type: 'TOOGLE_CONFIG_MODE'
    }
};

export const toogleAdminMode = () => {
    return {
        type: 'TOOGLE_ADMIN_MODE'
    }
};

export const toogleNavbarState = () => {
    return {
        type: 'TOOGLE_NAVBAR_STATE'
    }
};

export const updateNavbar = () => {
    return {
        type: 'UPDATE_NAVBAR'
    }
};

export const operationInitialize = (operation) => {
    return {
        type: 'OPERATION_INITIALIZE',
        payload: operation
    }
};

export const fetchingComponentInfo = () => {
    return {
        type: 'COMPONENT_INFO_FETCHING'
    }
};

export const initializeComponentInfo = (componentInfo) => {
    return {
        type: 'INITIALIZE_COMPONENT_INFO',
        payload: componentInfo
    }
}