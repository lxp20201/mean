/* 
Project Name : BoonBox
Filename     : cluster.js
Purpose      : Clustering is a great way to add stability to your application and drastically increase it's load capacity.
Author       : Rajesh Kumar Ranjan
Version      : 1.0  
Date         : 18-11-2018  
Receive      : 
Add          : 
*/

var cluster = require('cluster');

if (cluster.isMaster) {
  // Count the machine's CPUs
  var cpuCount = require('os').cpus().length;
  
  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
    
  }
  //print number of process is running in cluster
  // cluster.on('online',(worker)=>{
  //   console.log('process=',worker.process.pid)
  // })

  // Listen for dying workers
  cluster.on('exit', function () {
   
    cluster.fork();
  });
} else {
  require('../bin/www');
}
