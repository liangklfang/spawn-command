## spawn-command的使用
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
## spawn-command的源码分析
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
# ps命令查看所有的pid,PPID,PGID ,WINPID,UID等
<pre>
       PID    PPID    PGID     WINPID   TTY         UID    STIME COMMAND
    53136       1   53136      53136  ?         197108 16:24:59 /usr/bin/mintty
    50280   53136   50280      33620  pty0      197108 16:25:00 /usr/bin/bash
    59916   50280   59916      59928  pty0      197108 16:50:11 /usr/bin/ps
</pre>
我们可以通过PID和PPID知道我们的`进程树`！比如最后一个进程的PID为59916，而其PPID也就是父进程为50280，也就是第二个进程。同理，第二个进程的PPID也就是父进程为53136，也就是第一个进程了。该仅进程的父进程的PID为1！同时`COMMAND`列给出了具体的命令，这些命令可以直接运行的。如`/usr/bin/mintty`表示的就是终端，可以直接将COMMAND列放在终端中执行~至于后面的TTY，我们直接运行`/dev`，然后执行ls可以看到如下内容：
<pre>
clipboard  console  full    null  random  sda1  shm     stdin   ttyS0    zero
conin      dsp      kmsg    ptmx  scd0    sda2  sr0     stdout  urandom
conout     fd       mqueue  pty0  sda     sda3  stderr  tty     windows
</pre>
# kill一个进程
```bash
$ my_command & sleep 5 
$ kill -0 $! && kill $!
#$!表示Shell最后运行的后台Process的PID
#$$表示该进程的PID(脚本运行的当前进程PID，可以表示当前shell的PID)
```
kill -0 pid 不发送任何信号，但是系统会进行错误检查。

所以经常用来检查一个进程是否存在，存在返回0；不存在返回1。因此，上面的shell脚本就是查看一个进程是否存在，如果存在那么才会真实调用kill。如果要弄清楚这部分内容可以查看[concurrently](https://github.com/liangklfang/concurrently)

# 用户组
请查看[这里](./src/index/index.md)

# 进程管理
请查看[这里](./src/index/system-management.md)




参考资料:

[gulp watch 和 webpack watch 如何在同一个命令窗口下执行？](https://www.zhihu.com/question/49931997?sort=created)

[shell中的nohup命令](https://ss64.com/bash/nohup.html)

[shell中的watch命令](https://ss64.com/bash/watch.html)

[shell的bg命令](https://ss64.com/bash/bg.html)

[shell的fg命令](https://ss64.com/bash/fg.html)

[shell的jobs](https://ss64.com/bash/jobs.html)

[Shell脚本中获取进程ID的方法(子shell的pid，主shell的$PPID，以及$UID)](http://www.jb51.net/article/62370.htm)

[kill -0 pid是做什么用的？](http://blog.csdn.net/pecywang/article/details/8558968)

[shell中$0,$?,$!等的特殊用法](http://blog.csdn.net/tdstds/article/details/24814445)

[ Linux中TTY是什么意思 ](http://blog.chinaunix.net/uid-8194676-id-2513202.html)