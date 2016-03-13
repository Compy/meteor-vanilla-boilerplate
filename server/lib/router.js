Router.route('serverroute', {
  path: '/server',
  where: 'server',
  action: function () {
    console.log("Server route hit!");
    this.response.end("Hello from the server!");
  }
});
