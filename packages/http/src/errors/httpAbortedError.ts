import HttpInterruptedError from '@foscia/http/errors/httpInterruptedError';

/**
 * Error thrown when HTTP adapter catch a {@link !fetch | `fetch`}
 * {@link !DOMException | `DOMException`} with name `AbortError`.
 *
 * @group Errors
 */
export default class HttpAbortedError extends HttpInterruptedError<DOMException> {
}
