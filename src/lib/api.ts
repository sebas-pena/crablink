import { type ILink } from "../db/models/Link";
import { type IUserPopulated } from "../db/models/User";

type HttpErrorStatus =
  | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409
  | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421
  | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451
  | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511;

type HttpSuccessStatus = 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226;

type SuccessApiResponse<T> = {
  message: string;
  status: HttpSuccessStatus;
  data: T;
};

type ErrorResponse = {
  message: string;
  status: HttpErrorStatus;
  data: null;
};

export type CreateLinkResponse = SuccessApiResponse<ILink> | ErrorResponse;

export type GetUserResponse = SuccessApiResponse<IUserPopulated> | ErrorResponse;

export function createErrorResponse(response: ErrorResponse): Response {
  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
    status: response.status
  });
}

export function createApiResponse<T>(response: SuccessApiResponse<T>): Response {
  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
    status: response.status
  });
}