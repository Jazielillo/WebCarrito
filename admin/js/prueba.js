const firebaseConfig = {
  apiKey: "AIzaSyDwkhwJW0W63BLCik72IRqAL9EOhIsmoko",
  authDomain: "fir-df1ec.firebaseapp.com",
  projectId: "fir-df1ec",
  storageBucket: "fir-df1ec.appspot.com",
  messagingSenderId: "775054586512",
  appId: "1:775054586512:web:cf8bc09020c2f184a95e15",
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
  getDocs,
  getDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
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

export async function subirInformacion(
  tabla,
  titulo,
  fileInput,
  id,
  dato1,
  dato2,
  dato3,
  dato4
) {
  const tituloInput = titulo;
  let data;

  if (fileInput && fileInput.files.length > 0) {
    try {
      const file = fileInput.files[0];
      const storageRef = ref(storage, `${tabla}/${tituloInput}`);

      if (tabla === "Productos") {
        await uploadBytes(storageRef, file);

        // Obtén la URL de descarga
        const downloadURL = await getDownloadURL(storageRef);
        data = {
          url: downloadURL,
          nombre: tituloInput,
          id,
          cantidad: parseInt(dato1),
          precio: parseInt(dato2),
          descripcion: dato3,
          estatus: dato4,
        };
      }
      await setDoc(doc(firestore, `${tabla}`, `${id}`), data);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      alert("Error al subir la imagen");
    }
  } else if (tabla === "Usuarios") {
    data = {
      nombre: tituloInput,
      id,
      password: dato2,
      edad: parseInt(dato1),
      usuario: dato3,
      email: dato4,
      carrito: {},
      estatus: "inactivo",
    };
    await setDoc(doc(firestore, `${tabla}`, `${id}`), data);
  } else if (tabla === "Mensajes") {
    data = {
      nombre: titulo,
      email: dato2,
      mensaje: dato1,
      situacionMensaje: "no-leido",
      id,
    };
    await setDoc(doc(firestore, `${tabla}`, `${id}`), data);
  }
}

export async function obtenerInformacion(tabla, atributo, valor) {
  const q = query(
    collection(firestore, `${tabla}`),
    where(`${atributo}`, "==", `${valor}`)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.docs.length > 0) {
    return true; // Existen documentos que cumplen con el query
  } else {
    return false; // No existen documentos que cumplan con el query
  }
}

export async function verificarCredenciales(nombre, pass) {
  const citiesRef = collection(firestore, "Usuarios");
  const q1 = query(
    citiesRef,
    where("usuario", "==", nombre),
    where("password", "==", pass),
    where("estatus", "==", "activo")
  );

  try {
    const querySnapshot = await getDocs(q1);
    if (querySnapshot.empty) {
      return false; // No se encontraron credenciales válidas
    } else {
      return true; // Se encontraron credenciales válidas
    }
  } catch (error) {
    console.error("Error al verificar credenciales:", error);
    return false; // En caso de error, devolver false
  }
}

export async function verificarAdmin(nombre, pass) {
  const citiesRef = collection(firestore, "Usuarios");
  const q1 = query(
    citiesRef,
    where("usuario", "==", nombre),
    where("password", "==", pass),
    where("rol", "==", "administrador")
  );

  try {
    const querySnapshot = await getDocs(q1);
    if (querySnapshot.empty) {
      return false; // No se encontraron credenciales válidas
    } else {
      return true; // Se encontraron credenciales válidas
    }
  } catch (error) {
    console.error("Error al verificar credenciales:", error);
    return false; // En caso de error, devolver false
  }
}

export async function productoIgual(nombre) {
  const citiesRef = collection(firestore, "Productos");
  const q1 = query(citiesRef, where("nombre", "==", nombre));

  try {
    const querySnapshot = await getDocs(q1);
    if (querySnapshot.empty) {
      return false; // No se encontraron credenciales válidas
    } else {
      return true; // Se encontraron credenciales válidas
    }
  } catch (error) {
    console.error("Error al verificar credenciales:", error);
    return false; // En caso de error, devolver false
  }
}

export async function modificarInformacion(
  tabla,
  nombre,
  nuevoDato1,
  nuevoDato2,
  nuevoDato3,
  nuevoDato4,
  id
) {
  try {
    const q = query(collection(firestore, tabla), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Suponiendo que el nombre es único y solo hay un documento con ese nombre
      const docRef = querySnapshot.docs[0].ref;

      let nuevosDatos = {};

      if (tabla === "Productos") {
        if (nombre !== undefined) {
          nuevosDatos.nombre = nombre;
        }

        if (nuevoDato1 !== undefined) {
          nuevosDatos.cantidad = parseInt(nuevoDato1);
        }
        if (nuevoDato2 !== undefined) {
          nuevosDatos.precio = parseInt(nuevoDato2);
        }
        if (nuevoDato3 !== undefined) {
          nuevosDatos.descripcion = nuevoDato3;
        }
        if (nuevoDato4 !== undefined) {
          nuevosDatos.estatus = nuevoDato4;
        }
      } else {
        if (nombre !== undefined) {
          nuevosDatos.nombre = nombre;
        }

        if (nuevoDato1 !== undefined) {
          nuevosDatos.password = nuevoDato1;
        }
        if (nuevoDato2 !== undefined) {
          nuevosDatos.usuario = nuevoDato2;
        }
        if (nuevoDato3 !== undefined) {
          nuevosDatos.email = nuevoDato4;
        }
        if (nuevoDato4 !== undefined) {
          nuevosDatos.edad = parseInt(nuevoDato3);
        }
      }
      console.log(nuevosDatos);
      await updateDoc(docRef, nuevosDatos);
      console.log("Documento actualizado correctamente");
    } else {
      console.log("No se encontró ningún documento con ese nombre");
    }
  } catch (error) {
    console.error("Error al modificar el documento:", error);
    alert("Error al modificar el documento");
  }
}

export async function obtenerTodosLosDocumentos(tabla) {
  const q = query(collection(firestore, `${tabla}`));

  const querySnapshot = await getDocs(q);

  const documentos = querySnapshot.docs.map((doc) => doc.data());

  return documentos;
}

export async function modificarEstatus(id, estatus) {
  const washingtonRef = doc(firestore, "Productos", `${id}`);

  // Set the "capital" field of the city 'DC'
  await updateDoc(washingtonRef, {
    estatus,
  });
}

export async function modificarEstatusUsuario(id, estatus) {
  const washingtonRef = doc(firestore, "Usuarios", `${id}`);

  // Set the "capital" field of the city 'DC'
  await updateDoc(washingtonRef, {
    estatus,
  });
}

export async function modificarEstatusMensaje(id, situacionMensaje) {
  const washingtonRef = doc(firestore, "Mensajes", `${id}`);

  // Set the "capital" field of the city 'DC'
  await updateDoc(washingtonRef, {
    situacionMensaje,
  });
}

export async function obtenerDocumentoPorRol(tabla, atributo, valor) {
  const q = query(
    collection(firestore, `${tabla}`),
    where(`${atributo}`, "==", `${valor}`)
  );

  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    // Si hay documentos que cumplen con el filtro
    return querySnapshot.docs[0].data(); // Devuelve el primer documento encontrado
  } else {
    // Si no hay documentos que cumplan con el filtro
    return null;
  }
}

export async function agregarAlCarrito(usuarioId, productoId, cantidad) {
  try {
    const usuarioRef = doc(firestore, "Usuarios", `${usuarioId}`);
    const usuarioSnap = await getDoc(usuarioRef);

    if (!usuarioSnap.exists()) {
      console.error("El usuario no existe en la base de datos.");
      return;
    }

    const carritoRef = collection(usuarioRef, "carrito");
    const productoEnCarritoRef = doc(carritoRef, `${productoId}`);

    const productoRef = doc(firestore, "Productos", `${productoId}`);
    const productoSnap = await getDoc(productoRef);

    let cantidadMaxima = productoSnap.data().cantidad;

    if (!productoSnap.exists()) {
      console.error("El producto no existe en la base de datos.");
      return;
    }

    const productoData = productoSnap.data();
    const carritoSnap = await getDoc(productoEnCarritoRef);
    const carritoData = carritoSnap.exists() ? carritoSnap.data() : null;
    const cantidadActualEnCarrito =
      carritoData && carritoData.cantidad ? carritoData.cantidad : 0;
    console.log(cantidadActualEnCarrito);
    // Calcular la cantidad total que se quiere agregar al carrito
    const cantidadTotal = cantidadActualEnCarrito + cantidad;

    // Verificar si la cantidad total supera la cantidad disponible en stock
    if (cantidadMaxima < cantidadTotal) {
      console.error("Stock insuficiente para agregar al carrito.");
      return;
    }

    // Si la cantidad total es válida, agregar el producto al carrito
    await setDoc(productoEnCarritoRef, {
      nombre: productoData.nombre,
      cantidad: cantidadTotal,
      precio: productoData.precio,
    });

    return true;
  } catch (error) {
    return false;
  }
}

export async function obtenerCarrito(usuarioId) {
  try {
    const usuarioRef = doc(firestore, "Usuarios", `${usuarioId}`);
    const usuarioSnap = await getDoc(usuarioRef);

    if (!usuarioSnap.exists()) {
      console.error("El usuario no existe en la base de datos.");
      return;
    }

    const carritoRef = collection(usuarioRef, "carrito");
    const carritoSnapshot = await getDocs(carritoRef);

    const carrito = [];
    carritoSnapshot.forEach((doc) => {
      carrito.push({ id: doc.id, data: doc.data() });
    });

    return carrito;
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
  }
}

export async function entregarId(tabla, atributo, valor) {
  const citiesRef = collection(firestore, `${tabla}`);
  const q1 = query(citiesRef, where(`${atributo}`, "==", `${valor}`));
  const querySnapshot = await getDocs(q1);

  const documentos = querySnapshot.docs.map((doc) => doc.data());

  return documentos;
}

export async function movimientosCarrito(id, productoId, opcionCarrito) {
  try {
    const usuarioRef = doc(firestore, "Usuarios", `${id}`);
    const usuarioSnap = await getDoc(usuarioRef);

    if (!usuarioSnap.exists()) {
      console.error("El usuario no existe en la base de datos.");
      return;
    }

    // Obtener el snapshot del documento de usuario
    const carritoRef = collection(usuarioRef, "carrito");
    const carritoSnapshot = await getDocs(carritoRef);
    let carrito = [];
    // Obtener los datos del carrito desde el documento de usuario
    carritoSnapshot.forEach((doc) => {
      if (parseInt(doc.id) === productoId) {
        carrito.push(doc.data());
      }
    });

    let cantidadEnCarrito = carrito[0].cantidad;

    const productoRef = doc(firestore, "Productos", `${productoId}`);
    const productoSnap = await getDoc(productoRef);

    const productoEnCarritoRef = doc(carritoRef, `${productoId}`);

    //AQUI TENGO TODA LA CANTIDAD MAXIMO
    let cantidadMaxima = productoSnap.data().cantidad;

    let cantidadCorrecta = null;

    if (opcionCarrito === "mas") {
      cantidadEnCarrito++;
      if (cantidadEnCarrito <= cantidadMaxima) {
        cantidadCorrecta = true;
      } else {
        cantidadCorrecta = false;
      }
    } else if (opcionCarrito === "menos") {
      console.log(opcionCarrito);
      cantidadEnCarrito--;
      if (cantidadEnCarrito > 0) {
        cantidadCorrecta = true;
      } else {
        cantidadCorrecta = false;
      }
    }

    if (cantidadCorrecta) {
      await updateDoc(productoEnCarritoRef, {
        cantidad: cantidadEnCarrito,
      });
      return true;
    } else {
      return false;
    }

    // Si necesitas hacer algo más con los datos del carrito, aquí es donde lo haces
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
  }
}

export async function ventaCarrito(id, productoId, cantidad) {
  try {
    const usuarioRef = doc(firestore, "Usuarios", `${id}`);
    const usuarioSnap = await getDoc(usuarioRef);

    if (!usuarioSnap.exists()) {
      console.error("El usuario no existe en la base de datos.");
      return;
    }

    // Obtener el snapshot del documento de usuario
    const carritoRef = collection(usuarioRef, "carrito");
    const carritoSnapshot = await getDocs(carritoRef);
    let carrito = [];
    // Obtener los datos del carrito desde el documento de usuario
    carritoSnapshot.forEach((doc) => {
      if (parseInt(doc.id) === productoId) {
        carrito.push(doc.data());
      }
    });

    let cantidadEnCarrito = carrito[0].cantidad;

    const productoRef = doc(firestore, "Productos", `${productoId}`);
    const productoSnap = await getDoc(productoRef);

    const productoEnCarritoRef = doc(carritoRef, `${productoId}`);

    let stockProducto = parseInt(productoSnap.data().cantidad) - cantidad;
    console.log(stockProducto);

    if (stockProducto > -1) {
      await updateDoc(productoRef, {
        cantidad: stockProducto,
      });
      return true;
    } else {
      return false;
    }

    // Si necesitas hacer algo más con los datos del carrito, aquí es donde lo haces
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
  }
}

export async function eliminarCarrito(id) {
  const usuarioRef = doc(firestore, "Usuarios", `${id}`);
  const usuarioSnap = await getDoc(usuarioRef);

  if (!usuarioSnap.exists()) {
    console.error("El usuario no existe en la base de datos.");
    return;
  }

  // Obtener el snapshot del documento de usuario
  const carritoRef = collection(usuarioRef, "carrito");
  const carritoSnapshot = await getDocs(carritoRef);

  // Eliminar todos los documentos de la colección de carrito
  carritoSnapshot.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });

  console.log("Colección de carrito eliminada correctamente.");
}

export async function eliminarMensaje(id) {
  await deleteDoc(doc(firestore, "Mensajes", `${id}`));
}
