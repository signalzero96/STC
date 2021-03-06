import {
  addDoc,
  doc,
  getFirestore,
  setDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

class MessageRepository {
  constructor(app) {
    this.firestore_db = getFirestore(app);
  }
  syncMessage(roomId, onUpdate) {
    const ref = collection(this.firestore_db, `rooms/${roomId}/messages`);
    const q = query(ref, orderBy('time', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        content: doc.data().content,
        time: doc.data().time,
        userId: doc.data().userId,
      }));
      data && onUpdate(data);
    });
    return () => unsub();
  }
  initMessage(room) {
    setDoc(doc(this.firestore_db, `rooms/${room.roomId}/messages`, 'init'), {
      content: 'init completed!',
    });
  }
  saveMessage(message) {
    addDoc(collection(this.firestore_db, `rooms/${message.roomId}/messages`), {
      userId: message.userId,
      displayName: message.displayName,
      content: message.content,
      photoURL: message.photoURL,
      time: serverTimestamp(),
    });
  }
}

export default MessageRepository;
