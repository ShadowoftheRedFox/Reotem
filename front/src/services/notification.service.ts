import { Injectable } from '@angular/core';

export type NotificationType = "Image" | "Texte";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    constructor() { }

}
