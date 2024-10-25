const fs = require("node:fs");
const readline = require("node:readline");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const app = {};

// contoh script pembuatan folder
app.makeFolder = () => {
  rl.question("Masukan Nama Folder : ", (folderName) => {
    fs.mkdir(__dirname + `/${folderName}`, () => {
      console.log("Sukses membuat folder baru");
    });
    rl.close();
  });
};

// To Do : lanjutkan pembuatan logic disini

// MAKE FILE
// tinggal buat logic apabila folder sudah ada maka tinggal make file
app.makeFile = () => {
  rl.question("Masukan Nama Folder : ", (folderName) => {
    let fullPath = path.join(__dirname, folderName);
    console.log(fullPath);
    if (fs.existsSync(fullPath)) {
      app.askForFile(fullPath);
    } else {
      console.log(
        "Maaf folder anda tidak tersedia, file akan dimasukkan kedalam folder unorganize_folder"
      );
      let fullPath = path.join(__dirname, "unorganize_folder");
      app.askForFile(fullPath);
    }
  });
};

app.askForFile = (folderPath) => {
  rl.question("Masukan Nama file : ", (file) => {
    rl.question("Masukan extension : ", (ext) => {
      const files = fs
        .readdirSync(folderPath)
        .filter((item) => item === `${file}.${ext}`);

      if (files.length > 0) {
        console.log("Nama file sudah ada, mohon ganti nama file");
        askForFile(folderPath);
      } else {
        fs.writeFileSync(path.join(folderPath, `${file}.${ext}`), "");
        console.log(`File ${file}.${ext} sukses dibuat di ${folderPath}.`);
        rl.close();
      }
    });
  });
};

// EXT-SORTER
app.extSorter = () => {
  const res = fs.readdirSync("unorganize_folder");
  const rename = (folderName, element) => {
    fs.mkdir(__dirname + `/${folderName}`, { recursive: true }, (err) => {
      if (err && err.code !== "EXIST") throw err;
      fs.rename(
        __dirname + "/unorganize_folder/" + element,
        __dirname + `/${folderName}/` + element,
        (err) => {
          if (err) throw err;
        }
      );
    });
  };
  for (let index = 0; index < res.length; index++) {
    const element = res[index];
    const ext = element.split(".").pop();
    if (["txt", "pdf", "md"].includes(ext)) {
      rename("text", element);
    } else if (["jpg", "png"].includes(ext)) {
      rename("image", element);
    } else {
      rename("unknown", element);
    }
  }
  rl.close();
};

// READ FOLDER
app.readFolder = () => {
  rl.question("Masukkan Nama Folder : ", (folderName) => {
    const res = fs.readdirSync(folderName);
    const output = [];

    for (let index = 0; index < res.length; index++) {
      let element = res[index];
      const ext = element.split(".").pop();
      const fileTypes = {
        txt: "text",
        pdf: "text",
        md: "text",
        jpg: "image",
        png: "image",
      };
      let jenisFiles = fileTypes[ext] || "unknown";

      try {
        const stat = fs.statSync(__dirname + `/${folderName}` + "/" + element);
        let result =
          stat.size > 1048576
            ? parseInt(stat.size / 1048576) + " mb"
            : parseInt(stat.size / 1024) + " kb";
        output.push({
          namaFile: element,
          extensi: element.split(".")[element.split(".").length - 1],
          jenisFile: jenisFiles,
          tanggalDibuat: stat.birthtime,
          ukuranFile: result,
        });
      } catch (err) {
        console.log("Gagal membaca file", folderName, element);
      } finally {
        rl.close();
      }
    }
    console.log(output);
  });
};

app.readFile = () => {
  rl.question("Masukkan nama folder : ", (folderName) => {
    rl.question("Masukkan nama file: ", (file) => {
      rl.question("masukkan extensi : ", (ext) => {
        fs.readFile(`./${folderName}/${file}.${ext}`, "utf8", (err, data) => {
          if (err) {
            console.error("Maaf yang anda cari tidak ada");
            rl.close();
            return;
          }
          console.log(`isi dari file ${file}.${ext} : \n\n`, data);
          rl.close();
        });
      });
    });
  });
};

module.exports = app;
