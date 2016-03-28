var __ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    templateHelpers = require('./templateHelpers');

module.exports = function(templateFile, callback){
  var cur_dir = path.dirname(require.main.filename),
      file,
      compiledTmpl,
      wrappedTmpl;
  
  __.templateSettings.variable = "ob";
  if (window.isElectron) {
    file = fs.readFileSync(cur_dir + path.sep + templateFile, "utf8"),
    compiledTmpl = __.template(file);
  } else {
    var ctx = require.context('../templates', true, /\.html$/);
    compiledTmpl = ctx('./' + templateFile.substr(templateFile.lastIndexOf('/') + 1));
  }

  wrappedTmpl = function(context) {
    var mergedContext = __.extend({}, templateHelpers, context || {});

    return compiledTmpl(mergedContext); 
  };
  
  callback(wrappedTmpl);
};
