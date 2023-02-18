export const swr_get = async (url,) => {
    try {
        const response = await fetch(url);
        const result = await response.json();
        return result;
    }
    catch (error) {
        console.log(error);
    }
}
// post request using swr
export const swr_post = async (endpoint, options) => {
    const response = await fetch(endpoint, options);
    const result = await response.json();
    return result;
}
// put request using swr
export const swr_put = async (endpoint, options) => {
    const response = await fetch(endpoint, options);
    const result = await response.json();
    return result;
}
// delete request using swr
export const swr_delete = async (endpoint, options) => {
    const response = await fetch(endpoint, options);
    const result = await response.json();
    return result;
}