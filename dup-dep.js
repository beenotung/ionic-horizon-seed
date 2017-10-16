// to find duplicated dependencies in package.json

p = require('./package.json');

Object.keys(p.devDependencies).forEach(x=>{
  if(p.dependencies[x]){
    console.log(x, p.dependencies[x], p.devDependencies[x])
  }
});
