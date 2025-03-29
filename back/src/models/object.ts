import mongoose, { InferRawDocType, Schema } from "mongoose";
import { UserLevel, UserRole } from "../../../front/src/models/api.model";

const ObjectClass = ["LightObject", "ThermostatObject", "SpeakerObject", "VideoProjectorObject", "ComputerObject", "WindowStoreObject", "DoorObject", "WiFiObject", "BaseObject", "Erreur"];

const lightObjectSchema = {
  electricityUsage: Number,
  consomationThreshold: Number,
  battery: Number,
  turnedOn: Boolean,
  mode: { type: String, enum: ["Automatique", "Manuel"] },
};

const thermostatObjectSchema = {
  electricityUsage: Number,
  consomationThreshold: Number,
  battery: Number,
  turnedOn: Boolean,
  targetTemp: Number,
  currentTemp: Number,
  mode: { type: String, enum: ["Automatique", "Manuel"] },
};

const speakerObjectSchema = {
  electricityUsage: Number,
  consomationThreshold: Number,
  turnedOn: Boolean,
  battery: Number,
};

const videoProjectorObjectSchema = {
  electricityUsage: Number,
  consomationThreshold: Number,
  turnedOn: Boolean,
};

const computerObjectSchema = {
  electricityUsage: Number,
  consomationThreshold: Number,
  turnedOn: Boolean,
  battery: Number,
};

const windowStoreObjectSchema = {
  mode: { type: String, enum: ["Automatique", "Manuel"] },
  openState: Number,
  closeTime: Number,
};

const doorObjectSchema = {
  locked: Boolean,
  closed: Boolean,
  openTime: Number,
  closeTime: Number,
};

const wifiObjectSchema = {
  type: { type: String, enum: ["Routeur", "Répéteur", "Switch"] },
  turnedOn: Boolean,
  electricityUsage: Number,
};

export const lightObject = new Schema(lightObjectSchema);
export const thermostatObject = new Schema(thermostatObjectSchema);
export const speakerObject = new Schema(speakerObjectSchema);
export const videoProjectorObject = new Schema(videoProjectorObjectSchema);
export const computerObject = new Schema(computerObjectSchema);
export const windowStoreObject = new Schema(windowStoreObjectSchema);
export const doorObject = new Schema(doorObjectSchema);
export const wifiObject = new Schema(wifiObjectSchema);

type LightObjectSchema = InferRawDocType<typeof lightObjectSchema>;
type ThermostatObjectSchema = InferRawDocType<typeof thermostatObjectSchema>;
type SpeakerObjectSchema = InferRawDocType<typeof speakerObjectSchema>;
type VideoProjectorObjectSchema = InferRawDocType<typeof videoProjectorObjectSchema>;
type ComputerObjectSchema = InferRawDocType<typeof computerObjectSchema>;
type WindowStoreObjectSchema = InferRawDocType<typeof windowStoreObjectSchema>;
type DoorObjectSchema = InferRawDocType<typeof doorObjectSchema>;
type WiFiObjectSchema = InferRawDocType<typeof wifiObjectSchema>;

export type AnyObject = LightObjectSchema | ThermostatObjectSchema | SpeakerObjectSchema | VideoProjectorObjectSchema | ComputerObjectSchema | WindowStoreObjectSchema | DoorObjectSchema | WiFiObjectSchema;

const objectData: AnyObject = {};
const objectSchemaDefinition = {
    id: Number,
    name: String,
    room: String,
    building: String,
    neededRole: { type: String, enum: UserRole },
    neededLevel: { type: String, enum: UserLevel },
    lastInteraction: String,
    connection: { type: String, enum: ["Wi-Fi", "Cablé", "Bluetooth", "Déconnecté", "Autre"] },
    state: { type: String, enum: ["Normal", "Erreur", "Maintenance"] },
    objectClass: { type: String, enum: ObjectClass },
    objectData: objectData
  };

export const objectSchema = new Schema(objectSchemaDefinition);

export type ObjectSchema = InferRawDocType<typeof objectSchemaDefinition>;

export const ObjectModel = mongoose.model("Object", objectSchema);
