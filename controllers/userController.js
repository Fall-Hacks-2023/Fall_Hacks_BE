exports.getAllUsers = (req, res) => {
    // Sample logic for getting all users
    res.json({ message: "List of all users" });
};

exports.getUserById = (req, res) => {
    // Sample logic for getting a user by ID
    const userId = req.params.id;
    res.json({ message: `Details of user with ID ${userId}` });
};
