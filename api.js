const getVk = require('./login');
const {getUnique} = require("./utils");


const getLastPostInfo = async () => {
    const vk = await getVk();
    const response = await vk.api.wall.search({
        owner_id: process.env.PUB_ID,
        query: process.env.SEARCH_QUERY,
        count: 1,
        extended: 1
    })
    if(response && response.items && response.items.length) {
        return {
            id: response.items[0].id,
            likes: response.items[0].likes.count
        };
    } else {
        return false;
    }
}

const getLikesFromPost = async (postId, offset = 0) => {
    const opt = {
        type: 'post',
        owner_id: process.env.PUB_ID,
        item_id: postId,
        count: 1000,
        offset,
    };
    
    const vk = await getVk();
    const response = await vk.api.likes.getList(opt);
    if(response && response.items && response.items.length) {
        return response.items;
    } else {
        return false;
    }
}

const getUsersFromPost = async (postData) => {
    const vk = await getVk();
    const users = [];
    
    const iterationCount = (postData.likes / 1000) - (postData.likes / 1000).toFixed() > 0 ?
        ( parseInt((postData.likes / 1000).toFixed(), 10) + 1) :
        (postData.likes / 1000).toFixed();

    for (let i = 0; i < iterationCount; i++) {
        console.log('Получение списка пользователей ' ,(i / iterationCount * 100).toFixed() + '%')
        const _users = await getLikesFromPost(postData.id, i * 1000);
        const _usersUniq = getUnique(_users);
        const _usersInfo = await vk.api.users.get({
            user_ids: _usersUniq.join(','),
            fields: process.env.FIELDS || ''
        })
        users.push(..._usersInfo);
    }
    console.log('Получение списка пользователей 100%')


    return users || [];
}

module.exports = {
    getLastPostInfo,
    getLikesFromPost,
    getUsersFromPost,
}