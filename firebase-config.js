// =============================================
//  FIREBASE CONFIG - REEMPLAZA CON TUS DATOS
// =============================================
// 1. Ve a https://console.firebase.google.com
// 2. Crea un proyecto (o usa uno existente)
// 3. Agrega una app web: ícono </>
// 4. Copia el objeto firebaseConfig y pégalo abajo
// 5. En Firestore Database, crea la base de datos
// 6. En Authentication > Sign-in method, habilita "Anónimo"
// 7. En Firestore > Reglas, pega las reglas de abajo
// =============================================

const firebaseConfig = {
  apiKey: "AIzaSyBM-aLWYeveKECHHPPZK5o5dkOwk9VFsjE",
  authDomain: "datos-c711c.firebaseapp.com",
  projectId: "datos-c711c",
  storageBucket: "datos-c711c.firebasestorage.app",
  messagingSenderId: "1087875223991",
  appId: "1:1087875223991:web:84313278b612601eb31832",
  measurementId: "G-YJWRZYWP1Z"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

/*
  REGLAS DE SEGURIDAD PARA FIRESTORE:
  ------------------------------------
  Ve a Firestore Database > Reglas y pega esto:

  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /comentarios/{docId} {
        allow read: if true;
        allow create: if request.resource.data.rating >= 1
                      && request.resource.data.rating <= 5
                      && request.resource.data.comentario is string
                      && request.resource.data.comentario.size() <= 1000;
        allow update, delete: if false;
      }
    }
  }
*/
