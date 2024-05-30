const firebaseConfig = {
  apiKey: "AIzaSyCK7zVWPLge96q_bkh1gvPJJNqeCnqslfE",
  authDomain: "carrito-compras-1367a.firebaseapp.com",
  projectId: "carrito-compras-1367a",
  storageBucket: "carrito-compras-1367a.appspot.com",
  messagingSenderId: "1094106728627",
  appId: "1:1094106728627:web:9855e103bb9b178c2648c6"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";
import {
  getFirestore,
  collection,
  updateDoc,
  setDoc,
  doc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const storage = getStorage();
const firestore = getFirestore();

// Obtén una referencia a la colección "fotos" en Firestore
const fotosCollection = collection(firestore, "imagenes");



export function entregarImg() {
  // Retorna una promesa que resuelve con las fotos cuando estén disponibles
  return new Promise((resolve, reject) => {
    // Escucha cambios en la colección 'fotos' en tiempo real
    onSnapshot(
      fotosCollection,
      (snapshot) => {
        // Obtén los documentos de la colección 'fotos'
        const fotos = snapshot.docs.map((doc) => doc.data());
        // Muestra todas las imágenes en la lista
        // Resuelve la promesa con las fotos
        resolve(fotos);
      },
      (error) => {
        // Si hay un error, rechaza la promesa con el mensaje de error
        reject(error);
      }
    );
  });
}
export function entregarURL(id) {
  // Retorna una promesa que resuelve con la URL de la imagen cuando esté disponible
  return new Promise((resolve, reject) => {
    // Escucha cambios en la colección 'fotos' en tiempo real
    onSnapshot(
      fotosCollection,
      (snapshot) => {
        // Obtén los documentos de la colección 'fotos'
        const fotos = snapshot.docs.map((doc) => doc.data());
        // Encuentra la foto con el ID especificado
        const fotoEncontrada = fotos.find((foto) => foto.id === id);
        if (fotoEncontrada) {
          // Si se encontró la foto, resuelve la promesa con su URL
          resolve(fotoEncontrada.url);
        } else {
          // Si no se encontró la foto, rechaza la promesa con un mensaje de error
          reject(new Error(`No se encontró ninguna foto con el ID ${id}`));
        }
      },
      (error) => {
        // Si hay un error al obtener los datos, rechaza la promesa con el mensaje de error
        reject(error);
      }
    );
  });
}

export async function subirImagen(titulo, fileInput, id) {
  const tituloInput = titulo;
  console.log(fileInput.files.length)
  if (fileInput && fileInput.files.length > 0) {
    try {
      const file = fileInput.files[0];
      const storageRef = ref(storage, `imagenes/${id}`);

      await uploadBytes(storageRef, file);

      // Obtén la URL de descarga
      const downloadURL = await getDownloadURL(storageRef);
      let data = {
        url: downloadURL,
        nombre: tituloInput,
        id
      };
      await setDoc(doc(firestore, "imagenes", `${id}`), data);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      alert("Error al subir la imagen");
    }
  }else {
    const sinFoto = doc(firestore, "imagenes", `${id}`);

    // Set the "capital" field of the city 'DC'
    await updateDoc(sinFoto, {
      nombre:titulo,
    });
  }
}
