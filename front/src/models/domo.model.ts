import { UserRole, UserLevel } from "./api.model";

export type Mode = "Automatique" | "Manuel";

export type Connection = "Wi-Fi" | "Cablé" | "Bluetooth" | "Déconnecté" | "Autre";

export type ObjectState = "Normal" | "Erreur" | "Maintenance";

export type ObjectClass = "LightObject" |
    "ThermostatObject" |
    "SpeakerObject" |
    "VideoProjectorObject" |
    "ComputerObject" |
    "WindowStoreObject" |
    "DoorObject" |
    "WiFiObject" |
    "Erreur";

export type AnyObject = LightObject |
    ThermostatObject |
    SpeakerObject |
    VideoProjectorObject |
    ComputerObject |
    WindowStoreObject |
    DoorObject |
    WiFiObject |
    BaseObjectError;

export interface BaseObject {
    id: number;
    name: string;
    room: string;
    building?: string;
    neededRole?: UserRole;
    neededLevel: UserLevel;
    lastInteraction: string;
    connection: Connection;
    state: ObjectState;
    objectClass: ObjectClass;
}

interface BaseObjectError extends BaseObject {
    objectClass: "Erreur"
}

export interface LightObject extends BaseObject {
    objectClass: "LightObject";
    electricityUsage: number;
    consomationThreshold: number;
    battery?: number;
    turnedOn: boolean;
    mode: Mode;
}

export interface ThermostatObject extends BaseObject {
    objectClass: "ThermostatObject";
    electricityUsage: number;
    consomationThreshold: number;
    battery?: number;
    turnedOn: boolean;
    targetTemp: number;
    currentTemp: number;
    mode: Mode;
}

export interface SpeakerObject extends BaseObject {
    objectClass: "SpeakerObject";
    electricityUsage: number;
    consomationThreshold: number;
    turnedOn: boolean;
    battery?: number;
}

export interface VideoProjectorObject extends BaseObject {
    objectClass: "VideoProjectorObject";
    electricityUsage: number;
    consomationThreshold: number;
    turnedOn: boolean;
}

export interface ComputerObject extends BaseObject {
    objectClass: "ComputerObject";
    electricityUsage: number;
    consomationThreshold: number;
    turnedOn: boolean;
    battery?: number;
}

export interface WindowStoreObject extends BaseObject {
    objectClass: "WindowStoreObject";
    mode: Mode;
    openState: number;
    closeTime: number;
}

export interface DoorObject extends BaseObject {
    objectClass: "DoorObject";
    locked: boolean;
    closed: boolean;
    openTime: number;
    closeTime: number;
}

export interface WiFiObject extends BaseObject {
    objectClass: "WiFiObject";
    type: "Routeur" | "Répéteur" | "Switch";
    turnedOn: boolean;
    electricityUsage: number;
}

// alarms (fire or security)
