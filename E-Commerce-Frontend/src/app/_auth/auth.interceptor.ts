import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { UserAuthService } from "../_services/user-auth.service";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(private userAuthService: UserAuthService,
        private router: Router
    ){}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        if(request.headers.get("No-Auth") === 'True'){
            return next.handle(request.clone());
        }

        const token = this.userAuthService.getToken();
        request = this.addToken(request, token)
        return next.handle(request).pipe(

            catchError(
                (error: HttpErrorResponse) => {
                    console.log(error.status)
                    if(error.status === 401){
                        this.router.navigate(['/login']);
                    }else if(error.status === 403){
                        this.router.navigate(['/forbidden'])
                    }
                    return throwError("Somthing went wrong")
                }
            )
        );
    }

    private addToken(request: HttpRequest<any>, token:string){
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
    }
}