# Biometry
Para la realización del scanner biométrico se ha realizado un aprendizaje a grandes rasgos de ionic y angular. Además de aprender a utilizado la siguiente biblioteca https://github.com/Cap-go/capacitor-native-biometric la cual juntaba tanto el uso de la biometría en tu móvil, como el almacén seguro que se requieren para realizar un scanner móvil eficiente.
Gracias a uso de esta biblioteca y a los ejemplos en angular se a creado un scanner biométrico que funciona en Android.
### ¿Qué se ha hecho?
Se ha creado una típica página de login, con su usuario y contraseña. Donde primero de todo, se comprobará que tu móvil tiene la biometría disponible y si está activada previamente la huella.
La lógica es la siguiente, si tú entras en la página “home” de la aplicación, tienes un botón para activar la biometría, si la activas, la próxima vez que entres en la aplicación, te aparecerá un botón con la forma de una huella, donde solo poniendo tu dedo ya te deja pasar. Este botón solo funcionará y la biometría está disponible en el móvil.

Se ha creado una página típica de registro. En esta se crean el usuario y la contraseña, los daros se guardan en él localStorage, además de incluir 2 comprobaciones: comprobar si están todos los campos rellenos, comprobar si las contraseñas son iguales.

Por último, se ha creado una página “home” con 2 botones, uno para activar la biometría, donde se guardan las credenciales del usuario en un almacén seguro, también se comprueba que el móvil tiene biometría disponible y por último se activará la huella en el móvil.
El otro botón cerraría tu cuenta y por tanto borraría del almacén seguro los datos del usuario.

### Problemas encontrados
Lo primero fué aprender cómo se usa ionic y angular. Son dos tecnologías que nunca había usado antes, pero aprender los conocimientos básicos no fué muy complejas.
Lo peor de angular, ha sido tener más o menos claro cómo funcionan las promesas.
A la hora del desarrollo de la aplicación, lo peor ha sido enterarse de cómo funciona la biblioteca que nos facilitaron, tenía muchos problemas: primero la documentación que aparecía era muy pobre, además no tenían ningún ejemplo y por último tenía un apartado mal.
Otro problema grabe era que no se podía probar nada de la biblioteca, si no era directamente desde el móvil.
Supuestamente desde Android Studio debería emular la cámara y los datos biométricos, pero nada de eso funcionaba.
Solo cuando hice una apk y la descargaba en mi móvil pudé comprobar que todo funcionaba. 
Además, no siempre me dejaba buildear para crear el apk. Sino que primero me daba error, después tenia que borrar la carpeta Android que generába con los comandos de ionic y volver a crear la misma carpeta Android.
Por último, hubo un problema al crear el usuario en el local Storage, porque al crearlo en vez de llamar a los parametros “name” y “password”, los llame “nombre” y “password”. Por tanto, al hacer comprobaciones llamaba a “name” y no a “nombre” y me salía error.
### Soluciones
Lo primero fue fácil, me ley e intente sintetizar tanto la documentación de ionic como la de angular.
El segundo problema fue mas grabe. Lo que hice fue entender como podría funcionar porque los nombres de los métodos son intuitivos, y además como mi compañero julio tenía una librería que era muy parecida a la mía, me explico como era en su caso y ya entendí varía cosas de la mía. Pero el problema fue la parte del código que estaba mal, lo que estaba mal era como modificaban el MainActivity en Android Studio y para solucionar esto no encontré nada en internet solo los import que hacian falta por metodos a los que se llamaba, la solución simplemente fue leerlo los comentarios del MainActivity, como por ejemplo “inicializar el Bridge” o "Añadir un plugin", entonces me metí en el Bridge y me di cuenta del bridgeBuilder que justo tenía un addPlugin(), entonces supuse que ese addPlugin() funcionaría. Después, lo único que no puede solucionar fue la obligatoriedad de tener que crear un apk para comprobar la aplicación con esta librería.
Y además de tener que borrar la carpeta Android 2 veces, para poder buildear y poder crear la aplicación en Android Studio.
Por último el error de el nombre simplemente fue que ya no llamava a “name”, sino a “nombre”.

