export function number_format(number, decimals, dec_point, thousands_sep) {
  let i, j, kw, kd, km;
  if (isNaN(decimals = Math.abs(decimals))) {
    decimals = 2;
  }
  if (dec_point === undefined) {
    dec_point = ",";
  }
  if (thousands_sep === undefined) {
    thousands_sep = ".";
  }

  i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

  if ((j = i.length) > 3) {
    j = j % 3;
  } else {
    j = 0;
  }

  km = (j ? i.substr(0, j) + thousands_sep : "");
  kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
  kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");
  return km + kw + kd;
}

export function plural(val, str) {
  let  v = Math.abs(val) % 100, n = v % 10,
    p = (!n || n >= 5 || (v >= 5 && v <= 20)) ? 3 : ((n > 1 && n < 5) ? 2 : 1),
    s = str.split(',');
  return s[0] + s[p];
}