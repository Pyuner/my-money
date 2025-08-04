const DB_NAME = 'finance';
const DB_VER  = 1;

export async function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('expenses'))
        db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
      if (!db.objectStoreNames.contains('incomes'))
        db.createObjectStore('incomes', { keyPath: 'id', autoIncrement: true });
      if (!db.objectStoreNames.contains('positions'))
        db.createObjectStore('positions', { keyPath: 'id', autoIncrement: true });
      if (!db.objectStoreNames.contains('worklog'))
        db.createObjectStore('worklog', { keyPath: 'id', autoIncrement: true });
    };
  });
}

export async function add(store, obj) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).add(obj);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAll(store) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function del(store, id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}