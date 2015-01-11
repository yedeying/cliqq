var net = require('net');
var iconv = require('iconv-lite');
var charset = 'gbk';
var handle = function() {
  // do nothing
};
// 创建服务器
var inputHandle = function(data) {
  if(typeof send === 'function') {
    send(data);
  }
};
var send = null;
var server = net.createServer(function(socket) {
  socket.on('data', function(data) {
    console.log(data);
  });
  socket.on('end', function(data) {
    console.log('disconnected');
  });
  send = function(data) {
    data = iconv.decode(data, charset);
    data = data.replace(/\n|\r/g, '');
    socket.write(data.replace('\n', ''));
  };
});
server.listen(8124);
console.log('请输入对方的ip和端口号, 用空格隔开');
// 创建客户端
var client = null;
var ipReg = /^((0[0-9]|1[0-9]\d{1,2})|(2[0-5][0-5])|(2[0-4][0-9])|(\d{1,2}))\.((0[0-9]|1[0-9]\d{1,2})|(2[0-5][0-5])|(2[0-4][0-9])|(\d{1,2}))\.((0[0-9]|1[0-9]\d{1,2})|(2[0-4][0-9])|(2[0-5][0-5])|(\d{1,2}))\.((0[0-9]|1[0-9]\d{1,2})|(2[0-4][0-9])|(2[0-5][0-5])|(\d{1,2}))$/;
var createHandle = function(data) {
  data = iconv.decode(data, charset);
  data = data.replace(/\n/g, '').split(' ');
  if(data.length !== 2) {
    console.log('地址输入错误, 请重输');
    return;
  }
  var ip = data[0];
  var port = data[1];
  if(!ipReg.test(ip) || port < 0 || port > 65535) {
    console.log('地址输入错误, 请重输');
    return;
  }
  if(client === null) {
    client = net.connect(port, ip, function() {
      console.log('现在开始你们可以对话啦');
    });
    client.on('data', function(data) {
      console.log(data.toString());
    });
    process.stdin.removeListener('data', createHandle);
    process.stdin.on('data', inputHandle);
  }
}
// 监听命令行
process.stdin.resume();
process.stdin.on('data', createHandle);