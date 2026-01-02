# Pollos Rápidos — Aplicación de Pedidos (Front-end)

Aplicación web sencilla (sin servidor) para la gestión de pedidos de un restaurante de pollo. Permite:
- Gestionar el menú (agregar, editar, eliminar productos y precios).
- Incluir gaseosas u otras categorías.
- Tomar pedidos con número de orden incremental (1, 2, 3...).
- Llevar inventario / resumen de ventas del día por producto.
- Guardado local usando `localStorage`.

Archivos incluidos:
- `index.html` — Interfaz principal.
- `index.css` — Estilos.
- `index.js` — Lógica de la aplicación (gestión de menú, pedidos, inventario).
- `readme.md` — Este documento.

Cómo usar
1. Descarga los archivos y ábrelos en un navegador (por ejemplo, doble clic en `index.html`).
2. En "Menú" puedes:
   - Editar los productos existentes.
   - Agregar nuevos productos (nombre, precio, categoría).
   - El botón "Editar" convierte el renglón en campos editables; guarda cambios o elimina.
3. En "Tomar pedido":
   - Verás el menú por categoría.
   - Ingresa la cantidad y agrega al carrito.
   - Haz clic en "Realizar pedido" para crear la orden. Se asigna automáticamente el siguiente número.
   - El pedido se guarda en el historial y las ventas del día se actualizan.
4. Inventario / Ventas del día:
   - Muestra la cantidad vendida y el total recaudado por producto en la fecha actual.
   - Puedes resetear las ventas de hoy o exportar a CSV.
5. Historial:
   - Lista de pedidos con detalles. Puedes borrar todo el historial si lo deseas.

Persistencia
- Los datos se guardan en `localStorage` del navegador:
  - `pr_menu` — lista de productos.
  - `pr_orders` — pedidos realizados.
  - `pr_inventory` — ventas agrupadas por fecha.
  - `pr_lastOrderNumber` — número de orden incremental.

Notas y mejoras posibles
- Actualmente es una app local (no multiusuario). Para usar en varios dispositivos se requiere backend.
- Mejor control de stock físico (disminuir stock disponible) no está implementado por defecto, pero la estructura de datos facilita añadirlo.
- Añadir impresión de ticket o integración con impresora de cocina.
- Añadir filtros por fecha en el inventario/historial.

Licencia
- Código de ejemplo: úsalo y modifícalo libremente para tus necesidades.

¡Listo! Abre `index.html` y prueba la aplicación.