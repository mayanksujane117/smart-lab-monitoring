const bcrypt = require("bcryptjs");

async function run() {

  const password = "Alpha@8989";

  const hash = await bcrypt.hash(
    password,
    10
  );

  console.log(hash);

}

run();