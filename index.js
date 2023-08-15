exports.checkSchemaParams = function () {};

exports.i18n = function (dict) {
  return (selector, params) => {
    let s = selector(dict);
    for (const k of Object.keys(params)) {
      const v = params[k];
      const token = `{{${k}}}`;
      s = s.split(token).join(v);
    }
    return s;
  };
};
