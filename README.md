# 🏍️ TallerTobi - Frontend

Aplicación web moderna y responsive para gestión de talleres mecánicos de motos con calendario interactivo, gestión de clientes y servicios.

## 📋 Descripción

Frontend desarrollado en React que proporciona una interfaz intuitiva y completa para gestionar clientes, motos, servicios, turnos y recordatorios de mantenimiento en talleres mecánicos.

## ✨ Características Principales

### 📅 Gestión de Turnos
- **Calendario Semanal Interactivo**: Visualización clara de turnos agendados
- **Agendamiento de Servicios**: Sistema fácil para programar servicios
- **Recordatorios Automáticos**: Notificaciones 24 horas antes del turno
- **Lista de Repuestos**: Gestión de repuestos necesarios por turno
- **Estados de Turnos**: Visualización de turnos confirmados y pendientes
- **Filtros y Búsqueda**: Encuentra turnos rápidamente

### 👥 Gestión de Clientes
- **Registro Completo**: Datos personales y de contacto
- **Historial de Servicios**: Visualización de todos los servicios realizados
- **Control de Pagos**: Seguimiento de pagos y deudas pendientes
- **Notificaciones**: Alertas de clientes con saldo pendiente
- **Búsqueda Avanzada**: Filtros por nombre, email, teléfono

### 🏍️ Registro de Motos
- **Información Detallada**: Marca, modelo, año, kilometraje
- **Asociación con Clientes**: Cada moto vinculada a su dueño
- **Historial de Mantenimientos**: Seguimiento completo de servicios
- **Seguimiento de Servicios**: Próximos servicios programados
- **Actualización de Kilometraje**: Registro de cambios de kilometraje

### 🔧 Servicios y Mantenimiento
- **Ficha Técnica Completa**: Información detallada de cada servicio
- **Categorías de Servicios**:
  - Lubricación y flujo de combustible
  - Sistema eléctrico
  - Transmisión
  - Frenos y discos
- **Cálculo Automático de Costos**: Mano de obra + repuestos
- **Programación de Servicios**: Por días o kilometraje
- **Recordatorios Automáticos**: Alertas cuando se acerca la fecha

### 💰 Control Financiero
- **Registro de Montos**: Mano de obra y repuestos
- **Control de Pagos**: Pagos parciales y deudas
- **Dashboard Financiero**: Totales de ganancias acumuladas
- **Filtros Avanzados**: Por mes, año y estado de pago
- **Reportes**: Visualización de ingresos y gastos

### 📊 Dashboard
- **Métricas Clave**: Resumen de operaciones
- **Gráficos y Estadísticas**: Visualización de datos
- **Vista General**: Estado del taller

## 🛠️ Tecnologías

- **React 18** - Biblioteca de UI
- **Chakra UI** - Sistema de diseño
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **Date-fns** - Manejo de fechas
- **Moment-timezone** - Zonas horarias
- **Socket.io-client** - Comunicación en tiempo real
- **SweetAlert2** - Alertas y modales
- **Framer Motion** - Animaciones

## 📦 Instalación

### Prerrequisitos

- Node.js (v16 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd TallerTobi/frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear un archivo `.env` en la raíz del proyecto:

```env
# URL del backend API
REACT_APP_API_URL=http://localhost:5000/api

# Socket.io (Opcional)
REACT_APP_SOCKET_URL=http://localhost:5001
```

4. **Iniciar servidor de desarrollo**
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

5. **Build para producción**
```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `build/`

## 📁 Estructura del Proyecto

```
frontend/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── motor.png
├── src/
│   ├── components/
│   │   ├── Calendario/
│   │   │   ├── Calendario.js          # Componente de calendario
│   │   │   ├── ModalTurno.js          # Modal para crear/editar turnos
│   │   │   └── RepuestosModal.js      # Modal de repuestos
│   │   ├── ClientForm.js               # Formulario de clientes
│   │   ├── MotoForm.js                 # Formulario de motos
│   │   ├── ServicioForm.js             # Formulario de servicios
│   │   ├── Home/
│   │   │   ├── Home.js                 # Página principal
│   │   │   └── TypingEffect.js         # Efecto de escritura
│   │   └── RegistroCompleto/
│   │       ├── RegistroCompleto.js     # Registro completo de servicio
│   │       ├── ClienteModal.js          # Modal de cliente
│   │       ├── DatosServicioModal.js   # Modal de datos de servicio
│   │       ├── EditModal.js             # Modal de edición
│   │       └── MontoModal.js            # Modal de montos
│   ├── img/                             # Imágenes y assets
│   ├── theme/
│   │   └── theme.js                     # Configuración de tema
│   ├── App.js                           # Componente principal
│   ├── index.js                         # Punto de entrada
│   └── index.css                        # Estilos globales
├── .env                                 # Variables de entorno
├── package.json
└── README.md
```

## 🎯 Componentes Principales

### 📅 Calendario
- Vista semanal de turnos
- Agregar/editar/eliminar turnos
- Visualización de turnos confirmados y pendientes
- Gestión de repuestos por turno

### 👤 Gestión de Clientes
- Formulario completo de registro
- Listado de clientes con búsqueda
- Historial de servicios por cliente
- Control de deudas y pagos

### 🏍️ Gestión de Motos
- Registro de información del vehículo
- Asociación con cliente
- Actualización de kilometraje
- Historial de servicios

### 🔧 Gestión de Servicios
- Creación de servicios
- Categorización
- Programación de próximos servicios
- Cálculo de costos

### 📝 Registro Completo
- Registro integral de servicio
- Asociación cliente-moto-servicio
- Registro de datos técnicos
- Control de montos y pagos

## 🎨 Interfaz de Usuario

### Diseño
- **Responsive**: Adaptado a móviles, tablets y desktop
- **Tema Oscuro**: Interfaz moderna y cómoda
- **Navegación Intuitiva**: Fácil acceso a todas las funciones
- **Componentes Reutilizables**: Código limpio y mantenible

### Características Visuales
- Animaciones suaves
- Modales informativos
- Alertas y notificaciones
- Gráficos y visualizaciones
- Iconos descriptivos

## 🔄 Funcionalidades Interactivas

### Calendario Semanal
- Navegación entre semanas
- Vista clara de turnos
- Agregar turnos con un click
- Edición rápida de turnos

### Búsqueda y Filtros
- Búsqueda en tiempo real
- Filtros múltiples
- Ordenamiento de resultados
- Vista de detalles

### Formularios
- Validación en tiempo real
- Autocompletado
- Mensajes de error claros
- Guardado automático (futuro)

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- **Móviles**: Interfaz táctil optimizada
- **Tablets**: Vista intermedia
- **Desktop**: Funcionalidad completa

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm start

# Build para producción
npm run build

# Tests
npm test

# Eject (no recomendado)
npm run eject
```

## 🔌 Integración con Backend

La aplicación se comunica con el backend mediante:
- **REST API**: Peticiones HTTP con Axios
- **Socket.io**: Comunicación en tiempo real (opcional)
- **WebSockets**: Actualizaciones en vivo

## 📊 Estado de la Aplicación

- **Context API**: Gestión de estado global (si se implementa)
- **Estado Local**: Componentes con useState
- **Props**: Comunicación entre componentes

## 🎨 Personalización

### Tema
El tema se puede personalizar en `src/theme/theme.js` modificando los colores y estilos de Chakra UI.

### Componentes
Los componentes están diseñados para ser reutilizables y fáciles de modificar.

## 🧪 Testing

Para ejecutar tests:
```bash
npm test
```

## 📄 Licencia

ISC

## 👨‍💻 Autor

Desarrollado por [Ulises Ros](https://ulisesros-desarrolloweb.vercel.app/)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte, envía un email o abre un issue en el repositorio.

## 🎯 Objetivo

Sistema desarrollado para optimizar la gestión operativa de talleres mecánicos, reduciendo tiempos administrativos y mejorando la experiencia tanto del taller como del cliente.
