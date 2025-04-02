import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Connection, Mode, ObjectClass, ObjectState, WifiType } from '../../models/domo.model';
import { UserLevel, UserRole } from '../../models/api.model';
import { APIService } from '../../services/api.service';
import { AuthentificationService } from '../../services/authentification.service';

@Component({
    selector: 'app-test',
    imports: [
        RouterLink,
        MatButtonModule,
        MatTimepickerModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
    ],
    providers: [provideNativeDateAdapter()],
    templateUrl: './test.component.html',
    styleUrl: './test.component.scss'
})
export class TestComponent {
    constructor(
        private api: APIService,
        private auth: AuthentificationService
    ) { }

    fakeControl = new FormControl(0, [Validators.required, Validators.min(1), Validators.max(100)]);

    generateToken(n = 24) {
        if (n <= 0 || isNaN(n)) { n = 24; }
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let token = '';
        for (let i = 0; i < n; i++) {
            token += chars[Math.floor(Math.random() * chars.length)];
        }
        return token;
    }

    data = "";

    rb(i = 0.5) {
        return Math.random() >= i;
    }
    ri(m = 100) {
        return Math.floor(Math.random() * m);
    }

    ra<T>(a: T[]): string {
        return a[this.ri(a.length)] + '';
    }

    rd() {
        return new Date(this.ri(Date.now()));
    }


    generateFakeData() {
        if (!this.fakeControl || this.fakeControl.invalid) return;
        const tab: Record<string, unknown>[] = [];

        for (let i = 0; i < (this.fakeControl.value || 0); i++) {
            const object: Record<string, unknown> = {
                name: this.generateToken(this.ri(16)),
                room: this.generateToken(this.ri(16)),
                building: this.rb(0.5) ? this.generateToken(this.ri(16)) : undefined,
                neededRole: this.ra(UserRole as never) as UserRole,
                neededLevel: this.ra(UserLevel as never) as UserLevel,
                lastInteraction: this.rd().toISOString(),
                connection: this.ra(Connection as never) as Connection,
                state: this.ra(ObjectState as never) as ObjectState,
                objectClass: this.ra(ObjectClass as never) as ObjectClass,
            }

            switch (object['objectClass']) {
                case 'BaseObject':
                    break
                case 'LightObject':
                    (object as Record<string, unknown>)["turnedOn"] = this.rb();
                    (object as Record<string, unknown>)["electricityUsage"] = this.ri();
                    (object as Record<string, unknown>)["consomationThreshold"] = this.ri(1000);
                    (object as Record<string, unknown>)["battery"] = (this.rb() ? this.ri() : undefined);
                    (object as Record<string, unknown>)["mode"] = this.ra(Mode as never);
                    break;
                case 'ThermostatObject':
                    (object as Record<string, unknown>)["turnedOn"] = this.rb();
                    (object as Record<string, unknown>)["electricityUsage"] = this.ri();
                    (object as Record<string, unknown>)["consomationThreshold"] = this.ri(1000);
                    (object as Record<string, unknown>)["battery"] = (this.rb() ? this.ri() : undefined);
                    (object as Record<string, unknown>)["mode"] = this.ra(Mode as never);
                    (object as Record<string, unknown>)["targetTemp"] = 15 + this.ri(20);
                    (object as Record<string, unknown>)["currentTemp"] = 15 + this.ri(20);
                    break;
                case 'SpeakerObject':
                    (object as Record<string, unknown>)["turnedOn"] = this.rb();
                    (object as Record<string, unknown>)["electricityUsage"] = this.ri();
                    (object as Record<string, unknown>)["consomationThreshold"] = this.ri(1000);
                    (object as Record<string, unknown>)["battery"] = (this.rb() ? this.ri() : undefined);
                    break;
                case 'VideoProjectorObject':
                    (object as Record<string, unknown>)["turnedOn"] = this.rb();
                    (object as Record<string, unknown>)["electricityUsage"] = this.ri();
                    (object as Record<string, unknown>)["consomationThreshold"] = this.ri(1000);
                    break;
                case 'ComputerObject':
                    (object as Record<string, unknown>)["turnedOn"] = this.rb();
                    (object as Record<string, unknown>)["electricityUsage"] = this.ri();
                    (object as Record<string, unknown>)["consomationThreshold"] = this.ri(1000);
                    (object as Record<string, unknown>)["battery"] = (this.rb() ? this.ri() : undefined);
                    break;
                case 'WindowStoreObject':
                    (object as Record<string, unknown>)["openState"] = this.ri();
                    (object as Record<string, unknown>)["closeTime"] = this.rd().toISOString();
                    (object as Record<string, unknown>)["openTime"] = this.rd().toISOString();
                    (object as Record<string, unknown>)["mode"] = this.ra(Mode as never);
                    break;
                case 'DoorObject':
                    (object as Record<string, unknown>)["closeTime"] = this.rd().toISOString();
                    (object as Record<string, unknown>)["openTime"] = this.rd().toISOString();
                    (object as Record<string, unknown>)["locked"] = this.rb();
                    (object as Record<string, unknown>)["closed"] = this.rb();
                    break;
                case 'WiFiObject':
                    (object as Record<string, unknown>)["turnedOn"] = this.rb();
                    (object as Record<string, unknown>)["electricityUsage"] = this.ri();
                    (object as Record<string, unknown>)["type"] = this.ra(WifiType as never);
                    break;
            }

            tab.push(object);
        }

        // tab.forEach(o => {
        //     this.api.objects.create(o as AnyObject, this.auth.clientToken).subscribe();
        // });

        this.data = JSON.stringify(tab);
    }
}
