import { Task, History, HistoryRecord } from "./core";
import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";

function rmUndef<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

class FirestoreDB {
  private uuid2id = new Map<string, string>();
  private hr2doc = new WeakMap<
    HistoryRecord,
    firebase.firestore.DocumentReference
  >();
  private auth: firebase.auth.Auth;
  private db: firebase.firestore.Firestore;

  private tasksCollectionRef?: firebase.firestore.CollectionReference;
  private historyCollectionRef?: firebase.firestore.CollectionReference;

  constructor() {
    firebase.initializeApp({
      apiKey: "AIzaSyCN0rJX7W5RK8OPI0jEfnsWuxNK7SjEXNM",
      authDomain: "thefuckinplan.firebaseapp.com",
      databaseURL: "https://thefuckinplan.firebaseio.com",
      projectId: "thefuckinplan",
      storageBucket: "thefuckinplan.appspot.com",
      messagingSenderId: "618219839315",
      appId: "1:618219839315:web:fd95c104eb78be03"
    });

    this.auth = firebase.auth();
    this.db = firebase.firestore();
    this.db.enablePersistence();
  }

  async load() {
    const u = this.auth.currentUser;
    if (this.tasksCollectionRef) return;
    if (!u) throw new Error("Invalid call!");
    this.tasksCollectionRef = this.db.collection(`users/${u.uid}/tasks`);
    this.historyCollectionRef = this.db.collection(`users/${u.uid}/history`);
  }

  async getTasks() {
    const query = this.tasksCollectionRef!.limit(150);
    const snapshots = await query.get();
    const out: Task[] = [];
    snapshots.forEach(snap => {
      const id = snap.id;
      const data = snap.data() as Task;
      this.uuid2id.set(data.uuid, id);
      out.push(data);
    });
    return out;
  }

  async newTask(task: Task): Promise<void> {
    await this.tasksCollectionRef!.add(rmUndef(task));
  }

  async getHistory(): Promise<History> {
    const query = this.historyCollectionRef!.orderBy("created", "desc").limit(
      1000
    );
    const snapshots = await query.get();
    const out: History = [];
    snapshots.forEach(snap => {
      const data = snap.data() as HistoryRecord;
      this.hr2doc.set(data, snap.ref);
      out.push(data);
    });
    return out;
  }

  async push2History(hr: HistoryRecord): Promise<void> {
    await this.historyCollectionRef!.add({
      created: firebase.firestore.FieldValue.serverTimestamp(),
      ...rmUndef(hr)
    });
  }

  async delFromHistory(hr: HistoryRecord): Promise<void> {
    const ref = this.hr2doc.get(hr);
    if (!ref) throw new Error("Invalid HistoryRecord.");
    await ref.delete();
  }

  requestLogin(): void {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }

  logout(): void {
    firebase.auth().signOut();
  }

  onAuthStateChanged(cb: (user: firebase.User | null) => void) {
    firebase.auth().onAuthStateChanged(cb);
  }
}

const DBInstance = new FirestoreDB();

export default DBInstance;
