import tokenStore from "../stores/tokenStore";

/**
 * Link to the backend API server's root path
 */
const apiURL = 'http://localhost:8080/api/v1';

/**
 * Abstract request.
 * @param {*} path URL
 * @param {*} body JSON object
 * @param {String} type HTTP Request type
 * @returns The response
 * @throws error If the response is not in the 200 range
 */
const request = async (path, body, type = 'GET') => {
    let token = "";
    
    tokenStore.subscribe(tokenValue => {
        token += tokenValue.token;
    });
    
    const res = await fetch(apiURL + path, {
        method: type,
        body: body && JSON.stringify(body),
        headers: new Headers({ 'content-type': 'application/json', 'accept': 'application/json', 'authorization': `bearer ${token}`})
    });

    if (res.ok) {
        if (res.status === 204) return;
        return await res.json();
    } else {

        const errorRes = await res.json();

        const error = new Error(errorRes.cause);
        error.status = errorRes.code;

        throw error;
    }
};

export const registerNewUser = async (userData) => {
	try {
		return await request('/users', userData, 'POST');
	} catch (e) {
		throw e;
	}
};

export const getUser = async (username) => {
    try {
        return await request('/users/'+username);
    } catch (e) {
		throw e;
	}
};

export const loginUser = async (credentialsData) => {
	try {
        return await request('/users/login', credentialsData, 'POST');
	} catch (e) {
		throw e;
	}
};

export const logoutUser = async () => {
	try {
        return await request('/users/logout', undefined, 'POST');
	} catch (e) {
		throw e;
	}
};

export const updateUser = async (user,updateData) => {
    try {
        return await request('/users/'+user, updateData, 'PATCH');
    } catch (e) {
		throw e;
	}
};

export const deleteUser = async (username) => {
    try {
        await request('/users/'+username, undefined, 'DELETE');
    } catch (e) {
		throw e;
	}
};

export const getDataPresets = async () => {
    try {
        return await request('/items/data-presets');
    } catch (e) {
		throw e;
	}
};

export const getItems = async (filters) => {
    try {
        console.log(filters);
        if (filters) return await request(`/items?${filters}`);
        return await request('/items');
    } catch (e) {
		throw e;
	}
};

export const getItem = async (item) => {
    try {
        return await request('/items/'+item);
    } catch (e) {
		throw e;
	}
};

export const deleteAuction = async (item) => {
    try {
        await request('/items/'+item, undefined, 'DELETE');
    } catch (e) {
		throw e;
	}
};

export const deleteBid = async (bidID) => {
    try {
        await request('/bids/'+bidID, undefined, 'DELETE');
    } catch (e) {
		throw e;
	}
};

export const postNewItem = async (itemData) => {
    try {
        return await request('/items', itemData, 'POST');
    } catch (e) {
		throw e;
	}
};

export const updateAuction = async (item,updateData) => {
    try {
        return await request('/items/'+item+'/', updateData, 'PATCH');
    } catch (e) {
		throw e;
	}
};

export const getBids = async (item) => {
    try {
        return await request('/items/'+item+'/bids');
    } catch (e) {
		throw e;
	}
};

export const placeBid = async (item,bid) => {
    try {
        return await request('/items/'+item+'/bids', bid, 'POST');
    } catch (e) {
		throw e;
	}
};