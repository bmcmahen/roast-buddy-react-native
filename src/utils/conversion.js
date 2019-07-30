function linearConversion(a, b){
  var o = a[1] - a[0]
    , n = b[1] - b[0]

  return function(x){
    return (((x - a[0]) * n) / o) + b[0]
  }
}

export default linearConversion
