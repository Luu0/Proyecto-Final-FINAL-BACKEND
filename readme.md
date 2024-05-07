Este proyecto esta pensado para usarse a traves de postman, a continuacion paso sus endpoints y sus funcionalidades.

localhost:8080/users/register (Esta es una vista implementada en la pagina)
Esta es la ruta para que un usuario se registre

localhost:8080/users/login (Esta es una vista implementada en la pagina)
Esta es la ruta para que un usuario se loguee (necesario para acceder a otras rutas) 

localhost:8080/users (Esta es una vista implementada en la pagina)
Esta es la ruta para ver el usuario actualmente logueado (Solamente visible si antes el usuario se logueo) 

Cuenta necesaria para obtener el rol "admin" : email :adminCoder@coder.com
contraseña: adminCod3r123 (cualquier otra cuenta sera puesta con el rol "user")

localhost:8080/api/products (funcion get)
Esta es la ruta para mostrar todos los productos

localhost:8080/api/products (funcion post)
Esta es la ruta para postear productos a traves del body

localhost:8080/products (Esta es una vista implementada en la pagina)

localhost:8080/api/carts (funcion get)
Esta es la ruta para mostrar todos los carts

localhost:8080/api/carts (funcion post)
Esta es la ruta para postear un carrito a traves del body

Todos los otros enrutados de cart y product esten en los archivos productRouter.js 
y cartRouter.js

localhost:8080/chat
Esta es la ruta para ver el chat que solo puede usarlo un usario


localhost:8080/test/mockingproducts
Trae 100 productos que estan sacados de la api de fakerjs

localhost:8080/test/logger
Es una prueba del funcionamento de logger dependiendo que se usa npm run dev o npm run prod tirara diferentes errores

localhost:8080/:cid/purchase
Esta es la ruta para cuando el se quiera realizar una compra al carrito (requiere loguearse de atemano al mismo tiempo de un carrito
con productos adentro)


localhost:8080/apidocs
Esta es la ruta la cual muestra el funcionamiento de todos los enrutados de cart y products