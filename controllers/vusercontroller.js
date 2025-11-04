import vusermodel from "../models/vusermodel.js"; // .js likhna zaruri hai in ES Modules

// ✅ Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await vusermodel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Single User by ID
const getUserById = async (req, res) => {
  try {
    const user = await vusermodel.findById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Create User
const createUser = async (req, res) => {
  const user = new vusermodel(req.body);
  try {
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Update User
const updateUser = async (req, res) => {
  try {
    const updatedUser = await vusermodel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete User
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await vusermodel.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export { getAllUsers, createUser, getUserById, updateUser, deleteUser };
