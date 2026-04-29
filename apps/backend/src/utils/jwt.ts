import jwt from "jsonwebtoken";
import TicketError, { BrotherErrorTypes } from "./error";


export interface JwtPayload {
	accountId: string;
	email: string;
}

export async function generateToken(payload: JwtPayload): Promise<string> {
	const jwtSecret = process.env.JWT_SECRET
	if (!jwtSecret) {
		throw new TicketError(
			BrotherErrorTypes.UNAUTHORIZED,
			"Failed to retrieve the secrets",
			"invalid_secret_key",
		);
	}
	return jwt.sign(payload, jwtSecret, { expiresIn: 24 * 60 * 60 });
}

export async function verifyToken(token: string): Promise<JwtPayload> {
	const jwtSecret = process.env.JWT_SECRET
	if (!jwtSecret) {
		throw new TicketError(
			BrotherErrorTypes.UNAUTHORIZED,
			"Failed to retrieve the secrets",
			"invalid_secret_key",
		);
	}
	return jwt.verify(token, jwtSecret) as JwtPayload;
}
