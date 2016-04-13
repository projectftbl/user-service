module.exports = {
  required: true
, type: 'object'
, properties: {
    email: { type: 'string' }
  , name: { type: 'string' }
  , handle: { type: 'string' }
  , password: { type: 'string' }
  , shouldChangePassword: { type: 'boolean' }
  , verificationCode: { type: [ 'string', 'null' ] }
  , photo: { type: 'string' }
  , network: { 
      type: 'object' 
    , properties: {
        name: { type: 'string' }
      , link: { type: 'string' }
      , token: { type: 'string' }
      , secret: { type: 'string' }
      , handle: { type: 'string' }
      }
    }
  , networkId: { type: 'string' }
  , isLocked: { type: 'boolean' }
  , isArchived: { type: 'boolean' }
  , settings: { type: 'object' }
  , joinedAt: { type: 'string', format: 'date-time' }
  , roles: { type: 'array', items: { type: 'string' }}
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