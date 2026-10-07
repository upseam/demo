export interface UserError {
  field?: string[] | null;
  message: string;
}

export class ShopifyUserError extends Error {
  readonly userErrors: UserError[];

  constructor(operation: string, userErrors: UserError[]) {
    super(`${operation} failed: ${userErrors.map((e) => e.message).join("; ")}`);
    this.name = "ShopifyUserError";
    this.userErrors = userErrors;
  }
}

export class NotFoundError extends Error {
  constructor(what: string) {
    super(`${what} not found`);
    this.name = "NotFoundError";
  }
}
