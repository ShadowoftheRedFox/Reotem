import { UserRole } from "./api.model";

export type Mode = "Automatique" | "Manuel";

export type Connection = "Wi-Fi" | "Cablé" | "Bluetooth" | "Déconnecté" | "Autre"

export type ObjectState = "Normal" | "Erreur" | "Réparation"

export interface BaseObject {
    id: number;
    name: string;
    room: string;
    building?: string;
    neededRole: UserRole;
    lastInteraction: Date;
    connection: Connection;
    state: ObjectState;
}

export interface LightObject extends BaseObject {
    electricityUsage: number;
    consomationThreshold: number;
    battery?: number;
    turnedOn: boolean;
    mode: Mode;
}

export interface ThermostatObject extends BaseObject {
    electricityUsage: number;
    consomationThreshold: number;
    battery?: number;
    turnedOn: boolean;
    targetTemp: number;
    currentTemp: number;
    mode: Mode;
}

export interface SpeakerObject extends BaseObject {
    electricityUsage: number;
    consomationThreshold: number;
    turnedOn: boolean;
    battery?: number;
}

export interface VideoProjectorObject extends BaseObject {
    electricityUsage: number;
    consomationThreshold: number;
    turnedOn: boolean;
}

export interface ComputerObject extends BaseObject {
    electricityUsage: number;
    consomationThreshold: number;
    turnedOn: boolean;
    battery?: number;
}

export interface WindowStoreObject extends BaseObject {
    mode: Mode;
    openState: number;
    closeTime: number;
}

export interface DoorObject extends BaseObject {
    locked: boolean;
    closed: boolean;
    openTime: number;
    closeTime: number;
}

export interface WiFiObject extends BaseObject {
    type: "Routeur" | "Répéteur" | "Switch";
    turnedOn: boolean;
    electricityUsage: number;
}