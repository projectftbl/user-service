module.exports = {
  required: true
, type: 'object'
, properties: {
    name: { required: true, type: 'string' }
  , handle: { required: true, type: 'string' }
  , claims: { 
      type: 'array' 
    , items: {
        type: 'object'
      , properties: {
          entity: { required: true, type: 'string' }
        , right: { required: true, type: 'number' }
        }
      }
    }
  }
};
