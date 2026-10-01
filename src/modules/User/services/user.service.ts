import type { HTTP_RESPONSE, UserDTO } from "../dtos/user.dto";
import { UserRepository } from "../repositories/user.repository";
import {
  validateForgotPassword,
  validateLogin,
  validateUser,
} from "../utils/validations/user.validations";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const repository = new UserRepository();

export class UserService {
  public async createUser({ name, email, password }: UserDTO): Promise<void> {
    validateUser({ name, email, password });
    if (await repository.GetUserByEmail(email))
      throw new Error("User already exists");
    await repository.CreateUser({ name, email, password });
  }

  public async loginUser(
    email: string,
    password: string,
  ): Promise<{ user: UserDTO; token: string }> {
    validateLogin(email, password);
    const user = await repository.LoginUser(email, password);
    if (!user) throw new Error("Invalid email or password");

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" },
    );

    return { user, token };
  }

  public async forgotPassword(email: string) {
    const user = await repository.GetUserByEmail(email);
    if (!user) throw new Error("User not found");

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "15m",
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:3030/update-password/${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recuperação de senha",
      html: `
                <h2>Recuperação de senha</h2>
                <p>Clique no link abaixo:</p>
                <a href="${resetLink}">${resetLink}</a>
            `,
    });
  }

  public async updatePassword(
    email: string,
    password: string,
  ): Promise<UserDTO> {
    validateForgotPassword(email, password);
    const user = await repository.updatePassword(email, password);
    if (!user) throw new Error("User not found");
    return user;
  }
}
