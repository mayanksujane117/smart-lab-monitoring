const Service =
require("node-windows").Service;

const path =
require("path");

const svc =
new Service({

  name:
    "SLMS Agent",

  description:
    "Smart Lab Monitoring System Agent",

  script:
    path.join(
      __dirname,
      "client.js"
    ),

});

svc.on(

  "install",

  () => {

    console.log(
      "Service Installed"
    );

    svc.start();

  }

);

svc.on(

  "start",

  () => {

    console.log(
      "Service Started"
    );

  }

);

svc.install();