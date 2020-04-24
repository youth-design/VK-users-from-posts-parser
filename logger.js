const fs = require('fs');
const os = require('os');

const saveUsersToFile = async (users) => {
    const stream = fs.createWriteStream('log.txt');
    for (let user of users) {
        const userString = (
            user.first_name.padEnd(25, ' ') + 
            user.last_name.padEnd(25, ' ') +
            (parseInt(user.sex, 10) === 2 ? 'М' : 'Ж' ).padEnd(3) +
            `https://vk.com/id${user.id}`.padEnd(30) +
            (user.city && user.city.title ? user.city.title : '').padEnd(25) +
            (user.home_town ? user.home_town : '').padEnd(25) +
            os.EOL
        );
        stream.write(userString);
    }
    return true;
}

module.exports = {
    saveUsersToFile
}