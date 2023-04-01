import fs from "fs";
import os from "os";
import path from "path";

const { promises } = fs;

const users = [
  { name: "Mike", age: 25 },
  { name: "Bob", age: 32 },
  { name: "Nicola", age: 17 },
];

const newData = [
  { name: "Anna", age: 24 },
  { name: "Tom", age: 52 },
];

const data = { users };
const jsonUsers = JSON.stringify(data);
const homeDir = os.homedir();
const homeFilePath = path.join(homeDir, "data.json");
const currentFilePath = path.join(process.cwd(), "data.json");

console.log(homeFilePath);
console.log(currentFilePath);

const isExist = async (homeFilePath) => {
  try {
    await promises.stat(homeFilePath);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    } else {
      throw error;
    }
  }
};
isExist(homeFilePath)
  .then((exists) => {
    if (exists) {
      return promises.readFile(homeFilePath);
    } else {
      return promises.writeFile(homeFilePath, jsonUsers);
    }
  })

  .then((data) => {
    const parseUsers = JSON.parse(data);
    parseUsers.users.push(...newData);
    const updatedJsonUsers = JSON.stringify(parseUsers);

    return Promise.all([
      promises.writeFile(homeFilePath, updatedJsonUsers),
      promises.writeFile(currentFilePath, updatedJsonUsers)
    ]);
  })

  .then(() => {
    console.log("Data written to file");
  })
  .catch((err) => {
    console.error(err);
  });
