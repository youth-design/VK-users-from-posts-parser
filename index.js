require('dotenv').config();
const getVk = require('./login');
const {saveUsersToFile} = require("./logger");
const {getUnique} = require("./utils");
const {getLastPostInfo, getUsersFromPost} = require("./api");


(async () => {
    const postData = await getLastPostInfo();
    const users = await getUsersFromPost(postData);
    await saveUsersToFile(users);
})()
