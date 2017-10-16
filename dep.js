p=require('./package.json')
pl=require('./package-lock.json')

//console.log(Object.keys(pl.dependencies))
ids=pl.dependencies;

ds=p.dependencies
dds=p.devDependencies

//console.log(
  Object.keys(ids)
    .filter(x=>ds[x] || dds[x])
    .forEach(x=>{
      if(ds[x]){
        // ds
        // console.log(x,ds[x],ids[x].version)
        ds[x]=ids[x].version;
      }else{
        // dds
        // console.log(x,dds[x],ids[x].version)
        dds[x]=ids[x].version;
      }
    })
//)

p.dependencies=ds
p.devDependencies=dds

console.log(JSON.stringify(p))
