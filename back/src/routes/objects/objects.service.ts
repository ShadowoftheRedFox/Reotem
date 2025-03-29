// import HttpException from "../../models/HttpException";
import { ObjectQuery } from "../../../../front/src/models/api.model";
import HttpException from "~/models/HttpException";
import Reotem from "~/util/functions";


export const getAll = async (query: ObjectQuery = {}) => {
    const objects = await Reotem.getAllObjects();

    let resultObjects = objects;

    if (query?.type) {
        resultObjects = resultObjects?.filter(o => o.objectClass == query.type)
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

export const getOne = async (id: number) => {
    if (isNaN(id) || id < 0) {
        throw new HttpException(422);
    }

    const obj = await Reotem.getObject(id);

    if (obj == null) {
        throw new HttpException(404);
    }

    return obj;
}