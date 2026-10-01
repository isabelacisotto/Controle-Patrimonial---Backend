import type { UserDTO } from "../../dtos/user.dto";

function validateEmail(email: string): void {
    if (!email) throw new Error("Email is required");
    if (!/\S+@\S+\.\S+/.test(email)) throw new Error("Invalid email format");
}

function validatePassword(password: string): void {
    if (!password) throw new Error("Password is required");
    if (password.length < 8) throw new Error("Password must be at least 8 characters long");
}

function validateName(name: string): void {
    if (!name) throw new Error("Name is required");
    if (name.length < 3) throw new Error("Name must be at least 3 characters long");
}

export function validateUser({ name, email, password }: Partial<UserDTO>): void {
    if (!name || !email || !password) throw new Error("Missing required fields");
    validateEmail(email);
    validatePassword(password);
    validateName(name);
}

export function validateLogin(email: string, password: string): void {
    validateEmail(email);
    validatePassword(password);
}

export function validateForgotPassword(email: string, password: string): void {
    if (!email || !password) throw new Error("Missing required fields");
    validateEmail(email);
    validatePassword(password);
}