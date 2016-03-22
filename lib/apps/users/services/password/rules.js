module.exports = function(password) {
  var valid = true;

  return {
    minimum: function(minimum) {
      valid = valid && password.length >= minimum;

      return this; 
    }

  , alphabetic: function() {
      valid = valid && password.match(/[a-z]/i) != null;

      return this;
    }

  , numeric: function() {
      valid = valid && password.match(/[0-9]/) != null;

      return this; 
    }

  , capital: function() {
      valid = valid && password.match(/[A-Z]/) != null;

      return this; 
    }

  , symbol: function() {
      valid = valid && password.match(/[*@^£$!%&?+-=]/) != null;

      return this; 
    }

  , match: function(match) {
      valid = valid && password === match;

      return this;
    }

  , every: function(minimum) {
      return this.minimum(minimum).alphabetic().numeric().capital().symbol();
    }

  , valid: function() {;
      return valid === true;
    }
  }
};