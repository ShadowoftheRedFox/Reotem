const parseUser = (user) => {
    delete user.password;
    delete user.challenge;
    if (user.validated) user.validated = false;
    return user;
};

module.exports = { parseUser };