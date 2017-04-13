## Usage
```js
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
```
##下面是源码内容:
```js
var util = require('util');
var spawn = require('child_process').spawn;
module.exports = function (command, options) {
  var file, args;
  if (process.platform === 'win32') {
    //如果是windows平台，那么我们启动cmd.exe
    file = 'cmd.exe';
    args = ['/s', '/c', '"' + command + '"'];
    //windows上为cmd.exe传入参数
    options = util._extend({}, options);
    options.windowsVerbatimArguments = true;
    //选项值options
  }
  else {
    //如果是linux平台，那么使用/bin/sh
    file = '/bin/sh';
    //-c就是直接在linux中要执行的命令本身
    args = ['-c', command];
  }
  //采用的还是node.js的child_process的spawn
  return spawn(file, args, options);
};

```


参考资料:

[gulp watch 和 webpack watch 如何在同一个命令窗口下执行？](https://www.zhihu.com/question/49931997?sort=created)