console.log('euclides.js loaded')

euclides={}

euclides.readcsv=async (url)=>{
  if(!url&location.hash.length>3){ // if no url provided look for one in search
    url=location.hash.slice(1)
  }else{
    url='https://episphere.github.io/qaqc/iris.csv' // default url
  }
  euclides.url=url
  euclides.txt = await (await fetch(url)).text()
  euclides.arr = euclides.txt.split(/\n/g).slice(1).map(x=>x.split(',').map(v=>parseFloat(v)))
  if((euclides.arr.slice(-1)[0].length==1)&isNaN(euclides.arr.slice(-1)[0][0])){ // trailing blank
    euclides.arr=euclides.arr.slice(0,-1)
  }
  // clean non-numeric values
  euclides.numArr = euclides.arr.map(x=>x.filter(x=>!isNaN(x)))
  // crosstabulation of distances
  euclides.dists=[]
  euclides.numArr.forEach((xi,i)=>{ // for each row
    euclides.dists[i]=[]
    euclides.numArr.forEach((xj,j)=>{ // for each column
      euclides.dists[i][j]=euclides.distFun(xi,xj)
    })
  })
  let n = euclides.numArr.length
  euclides.avgDist=euclides.dists.map(x=>x.reduce((a,b)=>a+b)).reduce((a,b)=>a+b)/(n*(n-1)) // note identity diagonal omited
  return euclides
}

euclides.distFun=(xi,xj,i,j)=>{
  let sd=xi.map((v,i)=>Math.pow((xj[i]-v),2)) // squared deviation
  return Math.sqrt(sd.reduce((a,b)=>a+b)) // quared root of the sum
}

if(typeof(define)!='undefined'){
  define(euclides)
}
