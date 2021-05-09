var obj = {
  a: {
    a: "ss",
  },
  b: {
    a: "aa",
  },
  c: {
    a: "as",
  },
};
var ret = Object.keys(obj).find((e) => {
  return obj[e].a == "ss";
});

console.log(ret);
