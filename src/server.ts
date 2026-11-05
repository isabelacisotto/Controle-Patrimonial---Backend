import Express from "express";
import { UserHandler } from "./modules/User/handlers/user.handler";
import { authMiddleware } from "./middlewares/user.middleware";

const app = Express();
const handler = new UserHandler();

app.use(Express.json());

// User
app.post('/login', (req, res) => handler.loginUser(req, res));
app.post('/register', (req, res) => handler.createUser(req, res));
app.post('/forgot-password', (req, res) => handler.forgotPassword(req, res));
app.put('/update-password', (req, res) => handler.updatePassword(req, res));
app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: "This is a protected route" });
});

app.listen(3030, () => console.log("Server is running on port 3030"));