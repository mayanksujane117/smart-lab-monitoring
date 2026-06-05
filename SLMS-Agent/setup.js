const fs =
require("fs");

const readline =
require("readline");

const rl =
readline.createInterface({

  input:
  process.stdin,

  output:
  process.stdout,

});

rl.question(

  "Enter PC Name: ",

  (pcName) => {

    rl.question(

      "Enter Lab Name: ",

      (lab) => {

        const config = {

          pcName,

          lab,

        };

        fs.writeFileSync(

          "./config.json",

          JSON.stringify(

            config,

            null,

            2

          )

        );

        console.log(
          "\nSetup Complete"
        );

        rl.close();

      }

    );

  }

);