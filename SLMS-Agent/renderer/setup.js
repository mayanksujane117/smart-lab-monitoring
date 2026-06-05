const saveBtn =
document.getElementById(
  "saveBtn"
);

const message =
document.getElementById(
  "message"
);

saveBtn.addEventListener(

  "click",

  async () => {

    const pcName =
    document
      .getElementById(
        "pcName"
      )
      .value
      .trim();

    const labName =
    document
      .getElementById(
        "labName"
      )
      .value
      .trim();

    if (

      !pcName ||

      !labName

    ) {

      message.innerText =
      "Please fill all fields";

      return;

    }

    try {

      await window
        .electronAPI
        .saveConfig({

          pcName,

          lab: labName,

        });

      message.innerText =
      "Setup Complete";

    }

    catch (error) {

      console.log(
        error
      );

      message.innerText =
      "Failed to save";

    }

  }

);