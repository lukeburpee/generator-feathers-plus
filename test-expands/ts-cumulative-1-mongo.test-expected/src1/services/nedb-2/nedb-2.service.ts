
// Initializes the `nedb2` service on path `/nedb-2`
import { App } from '../../app.interface';

import createService from 'feathers-mongodb';
import hooks from './nedb-2.hooks';
import { Db, MongoClient } from 'mongodb';
// !<DEFAULT> code: imports
// import $jsonSchema from './nedb-2.mongo';
// !end
// !code: init // !end

let moduleExports = function (app: App) {
  let paginate = app.get('paginate');
  let mongoClient = app.get('mongoClient') as Promise<Db>;
  let options = { paginate };
  // !code: func_init // !end

  // Initialize our service with any options it requires
  // !<DEFAULT> code: extend
  app.use('/nedb-2', createService(options));
  // !end

  // Get our initialized service so that we can register hooks
  const service = app.service('nedb-2');

  // eslint-disable-next-line no-unused-vars
  let promise = mongoClient.then(db => {
    return db.createCollection('nedb-2', {
      // !<DEFAULT> code: create_collection
      // validator: { $jsonSchema: $jsonSchema },
      // validationLevel: 'strict', // The MongoDB default
      // validationAction: 'error', // The MongoDB default
      // !end
    });
  })
    .then(serviceModel => {
      (service as any).Model = serviceModel;
    });

  service.hooks(hooks);
  // !code: func_return // !end
};
// !code: more // !end

// !code: exports // !end
export default moduleExports;

// !code: funcs // !end
// !code: end // !end
