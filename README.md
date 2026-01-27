# Examen-Programacion-de-Componentes

Proyecto para examen de Programación de Componentes por Diego Campusano.

Este proyecto consiste en una aplicación que simula una tienda online donde el usuario puede crear una cuenta, iniciar sesión, ver los productos ofrecidos al igual que añadirlos si asi lo desea, y llevar estos a su propio carrito de compras en donde podrá quitar productos y ver el total antes de decidir comprar.

# Stack.

- Vite builder.
- React JSX (Backend).
- Firestore Database y Authentification (Base de datos No SQL y administrador de cuentas).
- Bootstrap y CSS minimo (Frontend).

# App Setup.

- Descarga del proyecto o copia de repositorio.
- Instalación de dependencias en la carpeta del proyecto mediante "npm install --force" en terminal.

# Firebase Setup.

- Crear de cuenta en Firebase Console.
- Crear un proyecto.
- Habilitar el uso de Firestore Database y Authentification.
- Como proveedor de Authentification usar Email/Password.
- Dentro de la configuración General del proyecto de Firebase Console, añadir una aplicación web y copiar y pegar las credenciales entregadas en los campos especificos en firebaseConfig.jsx, en la ruta <proyecto>/src/Firebase/ del proyecto.

# Uso.

1.- Webapp (Desarrollador).

- Correr "npm run dev" para inicio de aplicación en navegador como desarrollador.
- Abrir navegador en la URL indicada en el terminal.

2.- Aplicación movil Android.

- Correr comando "npm run build" en el proyecto.
- Creación de carpeta "cordova" dentro del proyecto.
- Dentro de esta carpeta correr el comando "cordova create ."
- En la misma carpeta, correr el comando "cordova platform add Android"
- Copiar los contenidos de la carpeta creada mediante "npm run build" en el primer paso de esta sección (Carpeta "dist" en este caso) dentro de la carpeta "www" dentro de cordova.
- Por ultimo, correr el comando "cordova build Android"

Estos pasos crearan una APK de pruebas en la ruta "<proyecto>/cordova/platform/android/app/build/outputs/apk/debug/" con el nombre "app-debug.apk" para su uso, ya sea mediante USB debugging o emulador.

Notas: 
- Se requiere un JDK mayor o igual a la version 11 instalada en el sistema.
- Se recomienda correr "cordova platform rm Android" antes de "cordova platform add Android" por si se dan problemas con este paso.

# Features.

- Creación de usuario.
- Inicio de sesión.
- Cierre de sesiíon.
- Tienda online donde se pueden eliminar y añadir productos propios.
- Stock de productos funcional con actualización en tiempo real, donde se puede llevar estos a un carrito de compras propio por usuario.
- Productos en el carrito de compras pueden ser eliminados.
- Carrito de compras muestra el precio total cargado y tiene un botón para realizar la compra (No funcional).



