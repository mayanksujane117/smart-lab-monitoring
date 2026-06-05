const Service =
require("node-windows").Service;

const path =
require("path");

const svc =
new Service({

  name:
    "SLMS Agent",

  script:
    path.join(
      __dirname,
      "client.js"
    ),

});

svc.uninstall();