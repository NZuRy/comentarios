// =============================================
//  FIREBASE CONFIG - COPIAR A firebase-config.js
// =============================================
// 1. Duplica este archivo como firebase-config.js
// 2. Reemplaza los valores con los de tu proyecto
// 3. Ve a https://console.firebase.google.com
//    Configuración del proyecto > Tus apps > Web
// =============================================

const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROJECT.firebaseapp.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_PROJECT.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
