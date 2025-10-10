import { HttpClient } from "@angular/common/http";  
import { EnvironmentInjector, Injectable, inject, runInInjectionContext, signal } from "@angular/core";  
import { environment } from "environments/environment";  
import { tap } from "rxjs";  
import { Contact } from "shared/models/contact..interface";   
import { toSignal } from '@angular/core/rxjs-interop';  
  
@Injectable({providedIn: 'root'})  
export class ContactsService {  
    public contacts = signal<Contact[]>([]);  
    private readonly _http = inject(HttpClient);  
    private readonly _endpoint = environment.apiURL;  
    private readonly _injector = inject(EnvironmentInjector);  
  
    constructor() {  
        this.getContacts();  
    }  
  
    // GET CONTACTS LIST  
    public getContacts(): void {  
        this._http.get<Contact[]>(`${this._endpoint}/contacts`)  
            .pipe(  
                tap((contacts: Contact[]) => this.contacts.set(contacts))  
            )  
            .subscribe();  
    }  
  
    // GET CONTACT BY ID  
    public getContactById(id: string) {  
        return runInInjectionContext(this._injector, () =>  
            toSignal<Contact>(this._http.get<Contact>(`${this._endpoint}/contacts/${id}`))  
        );  
    }  
  
    // POST: create CONTACT  
    public createContact(contact: Omit<Contact, "id">) {  
        return this._http.post<Contact>(`${this._endpoint}/contacts`, contact).pipe(  
            tap((newContact) => {  
                this.contacts.update(contacts => [...contacts, newContact]);  
            })  
        );  
    }  
  
    // PUT: update CONTACT  
    public updateContact(id: string, contact: Partial<Contact>) {  
        return this._http.put<Contact>(`${this._endpoint}/contacts/${id}`, contact).pipe(  
            tap((updated) => {  
                this.contacts.update(contacts =>  
                    contacts.map(c => c.id === id ? updated : c)  
                );  
            })  
        );  
    }  
  
    // DELETE: delete CONTACT  
    public deleteContact(id: string) {  
        return this._http.delete(`${this._endpoint}/contacts/${id}`).pipe(  
            tap(() => {  
                this.contacts.update(contacts => contacts.filter(c => c.id !== id));  
            })  
        );  
    }  
}