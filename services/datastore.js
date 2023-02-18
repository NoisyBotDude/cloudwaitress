const { Datastore } = require('@google-cloud/datastore');
const path = require('path');

class DatastoreClient {
    constructor() {
        this.datastore = new Datastore({
            projectId: process.env.PROJECT_ID,
            keyFilename: path.join(process.cwd(), './services/keyfile.json')
        });
    }
    /* data can be a object => eg- { description : 'a sweet name' } 
    or an array of properties => eg - [
            {
                name: 'created',
                value: new Date().toJSON(),
            },
            {
                name: 'description',
                value: 'vdffghs',
                excludeFromIndexes: true,
            }
        ], */
    async save(kind, name, data) {
        const taskKey = this.datastore.key([kind, name]);
        const task = {
            key: taskKey,
            data: data
        };
        await this.datastore.save(task);
    }
    async defaultSave(kind, data) {
        const taskKey = this.datastore.key(kind);
        const task = {
            key: taskKey,
            data: data
        };
        await this.datastore.save(task);
    }
    async saveSubTask(parentkind, parentname, kind, name, data) {
        const taskKey = this.datastore.key([
            parentkind,
            parentname,
            kind,
            name,
        ]);
        const task = {
            key: taskKey,
            data: data
        };
        await this.datastore.save(task);
    }
    async defaultSaveSubTask(parentkind, parentname, kind, data) {
        const taskKey = this.datastore.key([parentkind, parentname, kind]);
        const task = {
            key: taskKey,
            data: data
        };
        await this.datastore.save(task);
    }
    async get(kind, name) {
        const taskKey = this.datastore.key([kind, name]);
        const [task] = await this.datastore.get(taskKey);
        return task;
    }
    async defaultGet(kind) {
        const taskKey = this.datastore.key(kind);
        const [task] = await this.datastore.get(taskKey);
        return task;
    }
    async getSubTask(parentkind, parentname, kind, name) {
        const taskKey = this.datastore.key([
            parentkind,
            parentname,
            kind,
            name,
        ]);
        const task = await this.datastore.get(taskKey);
        return task;
    }
    async delete(kind, name) {
        const taskKey = this.datastore.key([kind, name]);
        await this.datastore.delete(taskKey);
    }
    async Exists(kind, name) {
        const data = await this.get(kind, name);
        if (data) return true;
        else return false;
    }
    async ArrLookUp(kind, arrName, val) {
        const query = await this.datastore.createQuery(kind).filter(arrName, '=', val);
        const [result] = await this.datastore.runQuery(query);
        return result;
    }
    // @returns an array of objects satisfying the query
    async FilterEquals(kind, v1, v2) {
        const query = await this.datastore.createQuery(kind).filter(v1, v2);
        const [result] = await this.datastore.runQuery(query);
        return result;
    }
    async GetAll(kind) {
        const query = await this.datastore.createQuery(kind);
        const [result] = await this.datastore.runQuery(query);
        return result;
    }
    //overwrites if exists otherwise inserts it
    async upsert(kind, name, data) {
        const taskKey = this.datastore.key([kind, name]);
        const entity = {
            key: taskKey,
            data: data
        }
        await this.datastore.upsert(entity);
    }
}
module.exports = new DatastoreClient();

