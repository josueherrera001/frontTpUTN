import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { finalize } from "rxjs";
import { SpinnerService } from "shared/services/spinner.service";


export const SpinnerInterceptor:HttpInterceptorFn = (req, next) =>{
    const spinnerSvc = inject(SpinnerService);

    spinnerSvc.show();
    return next(req).pipe(
         finalize( () => spinnerSvc.hide())
    );
}