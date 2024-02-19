const createConfig = (url :string, accessToken:any) => {
    return {
        method: 'POST',
        url: url.toString(),
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },

    }
}
module.exports = { createConfig };