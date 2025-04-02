// import HttpException from "../../models/HttpException";
import { ObjectQuery, UserLevel, UserRole } from "../../../../front/src/models/api.model";
import HttpException from "~/models/HttpException";
import { ObjectSchema } from "~/models/object";
import Reotem from "~/util/functions";
import { Connection, Mode, ObjectClass, ObjectState, WifiType } from "../../../../front/src/models/domo.model";

export const getAll = async (query: ObjectQuery = {}) => {
  const objects = await Reotem.getAllObjects();

  let resultObjects = objects;

  if (query?.type) {
    resultObjects = resultObjects?.filter((o) => o.objectClass == query.type);
  }

  if (query?.toDelete !== undefined) {
    resultObjects = resultObjects?.filter((o) => o.toDelete.delete === query.toDelete);
  }

  const n = resultObjects?.length;

  if (query?.limit && query.limit > 0) {
    if (query.step && query.step >= 0) {
      resultObjects = resultObjects?.slice(query.step * query.limit, (query.step + 1) * query.limit);
    } else {
      resultObjects = resultObjects?.slice(0, query.limit);
    }
  }

  return { objects: resultObjects, total: n };
};

export const getOne = async (id: string) => {
  if (id === "") {
    throw new HttpException(422);
  }

  const obj = await Reotem.getObject(id);

  if (obj == null) {
    throw new HttpException(404);
  }

  return obj;
};

export const createObject = async (input: { [key: string]: string }) => {
  const name = input.name || "";
  const room = input.room || "";
  const building = input.building || "";
  const neededRole: UserRole = (input.neededRole as UserRole) || "";
  const neededLevel: UserLevel = (input.neededLevel as UserLevel) || "";
  const state: ObjectState = (input.state as ObjectState) || "";
  const connection: Connection = (input.connection as Connection) || "";
  const objectClass: ObjectClass = (input.objectClass as ObjectClass) || "";
  const electricityUsage = input.electricityUsage || 0;
  const consomationThreshold = input.consomationThreshold || 0;
  const battery = input.battery || 0;
  const turnedOn = input.turnedOn || false;
  const targetTemp = input.targetTemp || 0;
  const currentTemp = input.currentTemp || 0;
  const mode: Mode = (input.mode as Mode) || "";
  const openState = input.openState || 0;
  const openTime = input.openTime || "";
  const closeTime = input.closeTime || "";
  const type: WifiType = (input.type as WifiType) || "";
  const locked = input.locked || false;
  const closed = input.closed || false;

  if (!name) {
    throw new HttpException(422, { name: "can't be blank" });
  }

  if (!room) {
    throw new HttpException(422, { room: "can't be blank" });
  }

  if (!neededRole) {
    throw new HttpException(422, { neededRole: "can't be blank" });
  }

  if (!neededLevel) {
    throw new HttpException(422, { neededLevel: "can't be blank" });
  }

  if (!state) {
    throw new HttpException(422, { state: "can't be blank" });
  }
  if (!connection) {
    throw new HttpException(422, { connection: "invalid" });
  }

  if (!objectClass) {
    throw new HttpException(422, { objectClass: "can't be blank" });
  }

  const lastInteraction = new Date().toISOString();

  const object: Partial<ObjectSchema> = {
    name: name,
    room: room,
    building: building,
    neededRole: neededRole,
    neededLevel: neededLevel,
    lastInteraction: lastInteraction,
    connection: connection,
    state: state,
    objectClass: objectClass,
  };
  let objectData = {};
  switch (object.objectClass) {
    case "LightObject":
      objectData = {
        electricityUsage: electricityUsage,
        consomationThreshold: consomationThreshold,
        battery: battery,
        turnedOn: turnedOn,
        mode: mode,
      };
      break;

    case "ThermostatObject":
      objectData = {
        electricityUsage: electricityUsage,
        consomationThreshold: consomationThreshold,
        battery: battery,
        turnedOn: turnedOn,
        targetTemp: targetTemp,
        currentTemp: currentTemp,
        mode: mode,
      };
      break;

    case "SpeakerObject":
      objectData = {
        electricityUsage: electricityUsage,
        consomationThreshold: consomationThreshold,
        battery: battery,
        turnedOn: turnedOn,
      };
      break;

    case "VideoProjectorObject":
      objectData = {
        electricityUsage: electricityUsage,
        consomationThreshold: consomationThreshold,
        turnedOn: turnedOn,
      };
      break;

    case "ComputerObject":
      objectData = {
        electricityUsage: electricityUsage,
        consomationThreshold: consomationThreshold,
        battery: battery,
        turnedOn: turnedOn,
      };
      break;

    case "WindowStoreObject":
      objectData = {
        openState: openState,
        closeTime: closeTime,
        openTime: openTime,
        mode: mode,
      };
      break;

    case "DoorObject":
      objectData = {
        locked: locked,
        closed: closed,
        openTime: openTime,
        closeTime: closeTime,
      };
      break;

    case "WiFiObject":
      objectData = {
        electricityUsage: electricityUsage,
        type: type,
        turnedOn: turnedOn,
      };
      break;

    default:
      break;
  }
  const newObject = await Reotem.addObject(object as ObjectSchema, objectData);
  return newObject;
};

export const dupplicateObject = async (input: ObjectSchema) => {
  const name = input.name || "";
  const room = input.room || "";
  const building = input.building || "";
  const neededRole: UserRole = (input.neededRole as UserRole) || "";
  const neededLevel: UserLevel = (input.neededLevel as UserLevel) || "";
  const state: ObjectState = (input.state as ObjectState) || "";
  const connection: Connection = (input.connection as Connection) || "";
  const objectClass: ObjectClass = (input.objectClass as ObjectClass) || "";
  const electricityUsage = input.electricityUsage || 0;
  const consomationThreshold = input.consomationThreshold || 0;
  const battery = input.battery || 0;
  const turnedOn = input.turnedOn || false;
  const targetTemp = input.targetTemp || 0;
  const currentTemp = input.currentTemp || 0;
  const mode: Mode = (input.mode as Mode) || "";
  const openState = input.openState || 0;
  const openTime = input.openTime || "";
  const closeTime = input.closeTime || "";
  const type: WifiType = (input.type as WifiType) || "";
  const locked = input.locked || false;
  const closed = input.closed || false;

  if (!name) {
    throw new HttpException(422, { name: "can't be blank" });
  }

  if (!room) {
    throw new HttpException(422, { room: "can't be blank" });
  }

  if (!neededRole) {
    throw new HttpException(422, { neededRole: "can't be blank" });
  }

  if (!neededLevel) {
    throw new HttpException(422, { neededLevel: "can't be blank" });
  }

  if (!state) {
    throw new HttpException(422, { state: "can't be blank" });
  }
  if (!connection) {
    throw new HttpException(422, { connection: "invalid" });
  }

  if (!objectClass) {
    throw new HttpException(422, { objectClass: "can't be blank" });
  }

  const lastInteraction = new Date().toISOString();

  const object: Partial<ObjectSchema> = {
    name: name,
    room: room,
    building: building,
    neededRole: neededRole,
    neededLevel: neededLevel,
    lastInteraction: lastInteraction,
    connection: connection,
    state: state,
    objectClass: objectClass,
  };
  let objectData = {};
  switch (object.objectClass) {
    case "LightObject":
      objectData = {
        electricityUsage: electricityUsage,
        consomationThreshold: consomationThreshold,
        battery: battery,
        turnedOn: turnedOn,
        mode: mode,
      };
      break;

    case "ThermostatObject":
      objectData = {
        electricityUsage: electricityUsage,
        consomationThreshold: consomationThreshold,
        battery: battery,
        turnedOn: turnedOn,
        targetTemp: targetTemp,
        currentTemp: currentTemp,
        mode: mode,
      };
      break;

    case "SpeakerObject":
      objectData = {
        electricityUsage: electricityUsage,
        consomationThreshold: consomationThreshold,
        battery: battery,
        turnedOn: turnedOn,
      };
      break;

    case "VideoProjectorObject":
      objectData = {
        electricityUsage: electricityUsage,
        consomationThreshold: consomationThreshold,
        turnedOn: turnedOn,
      };
      break;

    case "ComputerObject":
      objectData = {
        electricityUsage: electricityUsage,
        consomationThreshold: consomationThreshold,
        battery: battery,
        turnedOn: turnedOn,
      };
      break;

    case "WindowStoreObject":
      objectData = {
        openState: openState,
        closeTime: closeTime,
        openTime: openTime,
        mode: mode,
      };
      break;

    case "DoorObject":
      objectData = {
        locked: locked,
        closed: closed,
        openTime: openTime,
        closeTime: closeTime,
      };
      break;

    case "WiFiObject":
      objectData = {
        electricityUsage: electricityUsage,
        type: type,
        turnedOn: turnedOn,
      };
      break;

    default:
      break;
  }
  const newObject = await Reotem.addObject(object as ObjectSchema, objectData);
  return newObject;
};