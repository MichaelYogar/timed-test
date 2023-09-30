import { openDB } from "idb";

export async function setupDB() {
  const db = await openDB("NextAppDB", 1, {
    upgrade(db) {
      db.createObjectStore("videos", {
        keyPath: "id",
        autoIncrement: true,
      });
    },
  });
  return db;
}

export async function addVideo(videoBlob) {
  const db = await setupDB();
  console.log(videoBlob);
  return db.add("videos", { video: videoBlob });
}

export async function getVideos() {
  const db = await setupDB();
  return db.getAll("videos");
}

export async function clearVideos() {
  const db = await setupDB();
  return db.clear("videos");
}
