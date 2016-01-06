module.exports = {
  required: true
, type: 'object'
, properties: {
    name: { required: true, type: 'string' }
  , handle: { required: true, type: 'string' }
  , code: { required: true, type: 'number' }
  , photo: { type: 'string' }
  , apiKey: { type: 'string' }
  , securityKey: { 
      type: 'object'
    , properties: {
        low: { type: 'number' }
      , high: { type: 'number' }
      } 
    }
  , is: { 
      type: 'object' 
    , properties: {
        archived: { type: 'boolean' }
      }
    }
  }
};
