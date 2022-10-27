import { storage, firestore } from './database/firebase';
const bucket = storage.bucket();

interface User {
  name: string;
  phone: string;
  photos: string[];
}

const createUser = (user: User) => {
  // create a new user in the database
  firestore.collection('users').add(user);
};

const uploadPhoto = ()

const user: User = {
  name: 'John Doe',
  phone: '555-555-5555',
  photos: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
};
createUser(user);
