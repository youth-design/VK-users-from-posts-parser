const fs = require('fs');
const { VK } = require('vk-io');
const { Authorization } = require('@vk-io/authorization');

let vk = null;

const FILENAME = 'authdata.json'

async function getVk() {
    if(vk) {
        return vk;
    } else {
        vk = await loginWithToken().catch( (async err => {
            const authData = await loginWithCredentials();
            return await loginWithToken(authData.token);
        }) );
        
        return vk;
    }
}

const loginWithCredentials = async () => {
    const _vk = new VK({
        appId: process.env.APP_ID,
        appSecret: process.env.APP_SECRET,

        login: process.env.LOGIN,
        password: process.env.PASSWORD,

        authScope: ['wall'],
    });
    const authorization = new Authorization(_vk);

    const direct = authorization.implicitFlowUser();
    const response = await direct.run();
    writeAuthData(response);
    console.log('Authorized with credentials');
    return response;
}

const loginWithToken = async () => {
    const authData = await readAuthData();
    const _vk = new VK({
        token: authData.token
    });

    await _vk.api.wall.get({
        owner_id: 1
    });
    
    console.log('Authorized by token');
    return _vk;
}

const writeAuthData = (authData) => {
    return new Promise((res, rej) => {
        fs.writeFile(FILENAME, JSON.stringify(authData), (err) => {
            if(err) {
                rej(err);
            } else {
                res(true);
            }
        });
    });
}

const readAuthData = () => {
    return new Promise((res, rej) => {
        fs.readFile(FILENAME, (err, data) => {
            if(err) {
                rej(err);
            } else {
                if(!data.toString().length) {
                    return rej('Error data is empty!')
                }
                res(JSON.parse(data.toString()));
            }
        });
    });
}

module.exports = getVk;