import {getUser} from "../models/user.model.js";

export const getUserData = async (req, res) => {
    const { uid, email} = req.user;
    try {
        const userData = await getUser(uid);
        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }
        userData.email = email;

        res.json(userData);
    } catch (err) {
        console.error("Error fetching user data:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}