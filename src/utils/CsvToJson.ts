import fs from "fs";

const csvFilePath: string = "../public/assets/isw.csv";
const jsonFilePath: string = "../public/assets/isw.json";
//
// csv()
//   .fromFile(csvFilePath)
//   .then((jsonObj: any[]) => {
//     fs.writeFile(jsonFilePath, JSON.stringify(jsonObj, null, 2), (err: NodeJS.ErrnoException | null) => {
//       if (err) {
//         console.error(err);
//       } else {
//         console.log('Data written to file successfully!');
//       }
//     });
//   });


function parseCSVToJson(filePath = csvFilePath) {
  const fileData = fs.readFileSync(filePath, "utf-8");
  const lines = fileData.split("\n");
  const headers = lines[0].split(";");
  const jsonData: any = [];

  for (let i = 1; i < lines.length; i++) {
    const lineData = lines[i].split(";");
    const row: any = {};

    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = lineData[j];
    }

    jsonData.push(row);
  }
  let out = "[" + jsonData.map((el: any) => JSON.stringify(el)).join(",") + "]";

  fs.writeFile(jsonFilePath, out, (err: NodeJS.ErrnoException | null) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Data written to file successfully!");
    }
  });
}

parseCSVToJson();
