import { openDB } from "idb";

export const VIDEO_KEY = "videos";

export async function setupDB() {
  const db = await openDB("NextAppDB", 1, {
    upgrade(db) {
      db.createObjectStore(VIDEO_KEY, {
        keyPath: "id",
        autoIncrement: true,
      });
    },
  });
  return db;
}

export async function addVideo(videoBlob: Blob) {
  const db = await setupDB();
  return db.add(VIDEO_KEY, { video: videoBlob });
}

export async function getVideos() {
  const db = await setupDB();
  return db.getAll(VIDEO_KEY);
}

export async function clearVideos() {
  const db = await setupDB();
  return db.clear(VIDEO_KEY);
}
