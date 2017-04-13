var spawnCommand = require('spawn-command'),
    child = spawnCommand('echo "Hello spawn" | base64');
//这里的方法spawnCommand表示将我们的内部的命令放在一个子进程中执行，最后得到的就是"Hello spawn"的Base64编码
//这里的data就是我们的spawn-command传入的参数
child.stdout.on('data', function (data) {
  console.log('data', data);
  console.log('string-->',data.toString());
});

child.on('exit', function (exitCode) {
  console.log('exit', exitCode);
});