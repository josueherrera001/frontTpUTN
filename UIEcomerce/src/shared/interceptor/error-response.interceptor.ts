import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { catchError, throwError } from "rxjs";

export const ErrorResponseInterceptor:HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) =>
    next(req).pipe(catchError(handlerErrorResponse));

function handlerErrorResponse(error: HttpErrorResponse):ReturnType<typeof throwError>{
    const errorResponse = {
      error: error.error.error.code,
      message: error.error.error.message
    };
      debugger;
    return throwError( () => errorResponse);
}
