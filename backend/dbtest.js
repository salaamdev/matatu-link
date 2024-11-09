const User = require('./models/User'); // Adjust the path as necessary

async function getAllUsers () {
    try {
        const users = await User.findAll();
        console.log(users);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

getAllUsers();