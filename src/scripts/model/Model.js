/**
 *
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import DatabaseInstance from '../libs/Database';
import ConfigManagerInstance from '../libs/ConfigManager';

export default class Model {

  constructor (key) {
    this.key = key;
  }

  static get ASCENDING () {
    return 'next';
  }

  static get DESCENDING () {
    return 'prev';
  }

  static get UPDATED () {
    return 'Model-updated';
  }

  static get storeName () {
    return 'Model';
  }

  static nuke () {
    return DatabaseInstance()
        .then( db => db.close() )
        .then( db => db.nuke() );
  }

  static get (key) {

    if (this instanceof Model)
      Promise.reject("Can't call get on Model directly. Inherit first.");

    return DatabaseInstance()

        // Do the query.
        .then( db => db.get(this.storeName, key) )

        // Wrap the result in the correct class.
        .then( result => {

          return ConfigManagerInstance().then( configManager => {

            var store = configManager.getStore(this.storeName);

            if (!result)
              return;

            var resultKey = key;

            // If the store uses a keypath then reset
            // the key back to undefined.
            if (store.properties.keyPath)
              resultKey = undefined;

            return new this(result, resultKey);

          });

        });

  }

  /**
   * Gets all the objects from the database.
   */
  static getAll (index, order) {

    if (this instanceof Model)
      Promise.reject("Can't call getAll on Model directly. Inherit first.");

    return DatabaseInstance()

        // Do the query.
        .then( db => db.getAll(this.storeName, index, order) )

        // Wrap all the results in the correct class.
        .then( results => {

          return ConfigManagerInstance().then( configManager => {

            var store = configManager.getStore(this.storeName);
            var results_ = [];

            for (let result of results) {

              var key = result.key;

              // If the store uses a keypath then reset
              // the key back to undefined.
              if (store.properties.keyPath)
                key = undefined;

              results_.push(new this(result.value, key));
            }

            return results_;

          });

        });

  }

  put () {
    return this.constructor.put(this);
  }

  /**
   * Either inserts or update depending on whether the key / keyPath is set.
   * If the keyPath is set, and a property of the value matches (in-line key)
   * then the object is updated. If the keyPath is not set and the value's key
   * is null, then the object is inserted. If the keypath is not set and the
   * value's key is set then the object is updated.
   */
  static put (value) {

    if (this instanceof Model)
      Promise.reject("Can't call put on Model directly. Inherit first.");

    return DatabaseInstance()

        // Do the query.
        .then( db => db.put( this.storeName, value, value.key ) )

        .then( key => {

          return ConfigManagerInstance().then( configManager => {

            // Inserting may provide a key. If there is no keyPath set
            // the object needs to be updated with a key value so it can
            // be altered and saved again without creating a new appshell.
            var store = configManager.getStore( this.storeName );

            var keyPath =
                store.properties.keyPath;

            if (!keyPath)
              value.key = key;

            return value;

          })

        });

  }

  static deleteAll () {

    if (this instanceof Model)
      Promise.reject("Can't call deleteAll on Model directly. Inherit first.");

    return DatabaseInstance()

        .then( db => db.deleteAll( this.storeName ) )

        .catch( e => {
          // It may be that the store doesn't exist yet, so relax for that one.
          if (e.name !== 'NotFoundError')
            throw e;
        });

  }

  delete () {
    return this.constructor.delete(this);
  }

  static delete (value) {

    if (this instanceof Model)
      Promise.reject("Can't call delete on Model directly. Inherit first.");

    return ConfigManagerInstance().then( configManager => {

      // If passed the full object to delete then
      // grab its key for the delete
      if (value instanceof this) {

        var store = configManager.getStore( this.storeName );
        var keyPath = store.properties.keyPath;

        if (keyPath)
          value = value[keyPath];
        else
          value = value.key;
      }

      return DatabaseInstance()

        .then( db => db.delete( this.storeName, value ) );

    });
  }
}
