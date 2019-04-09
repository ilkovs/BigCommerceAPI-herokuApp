/**
 * Bigcommerce API Connection
 * connection.js
 * --------------
 * This Bigcommerce API Connection file is initialized with a user's
 * store's API information (hash, oAuth token, and app client_id)
 *
 * This file is responsible for performing all CRUD type operations 
 * to the Bigcommerce API for the specified user's account.
 *
 * All HTTP methods return a Promise.
 * The Promise is fulfilled by the handleResponse() method, which also
 * will automatically retry rate-limited requests.
 *
 * @author Rob Mullins rob@StoreRestore.io
 * @copyright SUREROB SOLUTIONS LLC, All Rights Reserved.
 * You may use this file free of charge, so long as you leave this original Copyright statement. 
 * There is no warranty for use of this file. Neither the authors nor SureRob Solutions LLC shall be liable for damages caused by using this file. 
 * @date 10/24/2015
 */

// Load class dependencies:
var Promise = require('promise');
var request = require('request');

/**
 * Construct
 * @param mixed config - Object containing:
 *    config.hash  - The user's store hash.
 *    config.token - The user's oAuth token.
 *    config.cid   - StoreRestore's App Client ID.
 *    config.host  - BigCommerce API Base URL
 */
function Connection(config) {
  // Return new instance if this called without 'new'.
  if (!(this instanceof Connection)) {
    return new Connection(config);
  }

  // Ensure config parameters set:
  if (typeof config === 'undefined') {
    throw new Error('Error: Connection needs to be initialized with a config parameter');
  } else if (typeof config.hash === 'undefined') {
    throw new Error('Error: Connection needs store hash - config.hash.');
  } else if (typeof config.token === 'undefined') {
    throw new Error('Error: Connection needs store oAuth token - config.token.');
  } else if (typeof config.cid === 'undefined') {
    throw new Error('Error: Connection needs app client id - config.cid.');
  } else if (typeof config.host === 'undefined') {
    throw new Error('Error: Connection needs BigComerce API Host URL - config.host.');
  }

  // Format the full API URL:
  this.host = config.host + '/stores/' + config.hash + '/v3/catalog';

  // Assign config locally:
  this.config = config;
}


Connection.prototype = {

  /**
   * @var object
   * Config object containing database connect data.
   */
  config: null,

  /** 
   * @var string
   * The BigCommerce API URL for given store.
   */
  host: null,

  /**
   * Performs an HTTP GET request to the provided BC endpoint.
   * The API path has already been set, so only the endpoint should be provided
   * WITH the beginning forward slash (/). Example: endpoint = '/products'.
   * NOTE: This file will self-correct if the forward slash was mistakenly left out. 
   *
   * @param endpoint string - The API resource endpoint to request. 
   * @return Promise - Promise containing the API response. 
   */
  get: function (endpoint) {
    var self = this;
    return new Promise(function (fulfill, reject) {
      // Make GET request:
      request(self.getRequestOptions('GET', endpoint), function (err, res, body) {
        // Check for client or BigCommerce error:
        if (err || res.statusCode !== 200) {
          return err ? reject(err) : reject(body); //Return request error if (err), else return the BC error (status != 200)
        }
        // Check to see if request was rate-limited:
        if (res.statusCode === 429) {
          var timeout = ((parseInt(res.headers["X-Retry-After"]) + 2) * 1000); //Parse rate-limit, add 2 seconds, convert to milliseconds.
          setTimeout(function () {
            fulfill(self.get(endpoint));
          }, timeout);
        } else {
          // Else response good, parse and return body:
          fulfill(JSON.parse(body));
        }
      });
    });
  },

  /**
   * Performs an HTTP PUT request to the provided BC endpoint.
   * The API path has already been set, so only the endpoint should be provided
   * WITH the beginning forward slash (/). Example: endpoint = '/products'.
   * NOTE: This file will self-correct if the forward slash was mistakenly left out. 
   *
   * @param endpoint string - The API resource endpoint to request. 
   * @param data mixed      - The request body, as an object (non-JSON parsed).
   * @return Promise - Promise containing the API response. 
   */
  put: function (endpoint, data) {
    var self = this;
    return new Promise(function (fulfill, reject) {
      // Make PUT request:
      request(self.getRequestOptions('PUT', endpoint, data), function (err, res, body) {
        // Check for client or BigCommerce error:
        if (err || res.statusCode !== 200) {
          return err ? reject(err) : reject(body); //Return request error if (err), else return the BC error (status != 200)
        }
        // Check to see if request was rate-limited:
        if (res.statusCode === 429) {
          var timeout = ((parseInt(res.headers["X-Retry-After"]) + 2) * 1000); //Parse rate-limit, add 2 seconds, convert to milliseconds.
          setTimeout(function () {
            fulfill(self.put(endpoint, data));
          }, timeout);
        } else {
          // Else response good, parse and return body:
          fulfill(JSON.parse(body));
        }
      });
    });
  },

  /**
   * Performs an HTTP POST request to the provided BC endpoint.
   * The API path has already been set, so only the endpoint should be provided
   * WITH the beginning forward slash (/). Example: endpoint = '/products'.
   * NOTE: This will self-correct if the forward slash was mistakenly left out. 
   *
   * @param endpoint string - The API resource endpoint to request. 
   * @param data mixed      - The request body, as an object (non-JSON parsed).
   * @return Promise - Promise containing the API response. 
   */
  post: function (endpoint, data) {
    var self = this;
    return new Promise(function (fulfill, reject) {
      // Make POST request:
      request(self.getRequestOptions('POST', endpoint, data), function (err, res, body) {
        // Check for client or BigCommerce error:
        if (err || res.statusCode !== 200) {
          return err ? reject(err) : reject(body); //Return request error if (err), else return the BC error (status != 200)
        }
        // Check to see if request was rate-limited:
        if (res.statusCode === 429) {
          var timeout = ((parseInt(res.headers["X-Retry-After"]) + 2) * 1000); //Parse rate-limit, add 2 seconds, convert to milliseconds.
          setTimeout(function () {
            fulfill(self.post(endpoint, data));
          }, timeout);
        } else {
          // Else response good, parse and return body:
          fulfill(JSON.parse(body));
        }
      });
    });
  },

  /**
   * Performs an HTTP DELETE request to the provided BC endpoint.
   * The API path has already been set, so only the endpoint should be provided
   * WITH the beginning forward slash (/). Example: endpoint = '/products'.
   * NOTE: This will self-correct if the forward slash was mistakenly left out. 
   *
   * @param endpoint string - The API resource endpoint to request. 
   * @return Promise - Promise containing the API response. 
   */
  delete: function (endpoint) {
    var self = this;
    return new Promise(function (fulfill, reject) {
      // Make DELETE request:
      request(self.getRequestOptions('DELETE', endpoint), function (err, res, body) {
        // Check for client or BigCommerce error:
        if (err || res.statusCode !== 200) {
          return err ? reject(err) : reject(body); //Return request error if (err), else return the BC error (status != 200)
        }
        // Check to see if request was rate-limited:
        if (res.statusCode === 429) {
          var timeout = ((parseInt(res.headers["X-Retry-After"]) + 2) * 1000); //Parse rate-limit, add 2 seconds, convert to milliseconds.
          setTimeout(function () {
            fulfill(self.delete(endpoint));
          }, timeout);
        } else {
          // Else response good, parse and return body:
          fulfill(JSON.parse(body));
        }
      });
    });
  },

  /**
   * Gets the common HTTP request options shared by
   * all request methods (get, put, post, delete).
   * @param method   <string> - The request method to make (GET|PUT|POST|DELETE).
   * @param endpoint <string> - The URI endpoint the request will be connecting to.
   * @param data     <mixed>  - The request body for PUTs|POSTs, or null for GETs|DELETEs.
   * @return mixed - Object containing the options to execute a HTTP request. 
   */
  getRequestOptions: function (method, endpoint, data) {
    // Return the Request Options:
    return {
      // URL will append a forward slash prior to the endpoint if it was left out:
      url: endpoint.substring(0, 1) !== '/' ? this.host + '/' + endpoint : this.host + endpoint,
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Auth-Client': this.config.cid,
        'X-Auth-Token': this.config.token
      },
      body: data ? JSON.stringify(data) : null
    };
  },


};

module.exports = Connection;