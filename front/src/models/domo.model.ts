import { UserRole, UserLevel } from "./api.model";

export const Mode = [
    "Automatique",
    "Manuel"
] as const;
export type Mode = typeof Mode[number];

export const Connection = [
    "Wi-Fi",
    "Cablé",
    "Bluetooth",
    "Déconnecté",
    "Autre"
] as const;
export type Connection = typeof Connection[number];

export const ObjectState = [
    "Normal",
    "Erreur",
    "Maintenance"
] as const;
export type ObjectState = typeof ObjectState[number];

export const ObjectClass = [
    "LightObject",
    "ThermostatObject",
    "SpeakerObject",
    "VideoProjectorObject",
    "ComputerObject",
    "WindowStoreObject",
    "DoorObject",
    "WiFiObject",
    "BaseObject",
    "Erreur"
] as const;

export type ObjectClass = typeof ObjectClass[number];

export type AnyObject = BaseObject |
    LightObject |
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

export interface BaseObjectOnly extends BaseObject {
    objectClass: "BaseObject"
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
