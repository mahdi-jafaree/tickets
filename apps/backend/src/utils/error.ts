export const BrotherErrorTypes = {
	DUPLICATE_ERROR: "duplicate_error",
	UNAUTHORIZED: "unauthorized",
	BAD_REQUEST: "bad_request",
	NOT_FOUND: "bad_request",
	FORBIDDEN: "forbidden",
};
class TicketError<T = unknown> extends Error {
	public type: string;
	public code: string;
	public data?: T;
	public message: string;
	public date: Date;

	constructor(type: string, message: string, code: string, data?: T) {
		super();
		this.type = type;
		this.message = message;
		this.code = code;
		this.data = data;
		this.date = new Date();
	}
}
export default TicketError;
