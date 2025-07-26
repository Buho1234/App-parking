# ParkDrive - Aplicación de Estacionamientos

Una aplicación móvil tipo inDrive pero enfocada en el alquiler y búsqueda de espacios de estacionamiento. Los usuarios pueden ser **Buscadores** (que buscan estacionamiento) o **Arrendadores** (que ofrecen sus espacios).

## 🚀 Características Principales

### Para Buscadores de Estacionamiento
- **Búsqueda en mapa**: Encuentra estacionamientos cercanos en tiempo real
- **Filtros avanzados**: Por precio, distancia, tipo de vehículo, características
- **Solicitudes de reserva**: Envía solicitudes con precio propuesto
- **Negociación de precios**: Propón tu precio como en inDrive
- **Chat integrado**: Comunícate directamente con los arrendadores
- **Navegación GPS**: Cómo llegar al estacionamiento
- **Historial de reservas**: Ve todas tus reservas pasadas y activas

### Para Arrendadores de Espacios
- **Gestión de espacios**: Agrega, edita y administra tus estacionamientos
- **Recepción de solicitudes**: Acepta o rechaza solicitudes de reserva
- **Control de disponibilidad**: Activa/desactiva espacios según necesites
- **Estadísticas**: Ve tus ingresos y ocupación
- **Calificaciones**: Sistema de rating bidireccional
- **Instrucciones de acceso**: Comparte códigos, instrucciones especiales

## 🛠 Tecnologías Utilizadas

- **React Native 0.72.6** - Framework móvil multiplataforma
- **TypeScript** - Tipado estático para mayor robustez
- **Redux Toolkit** - Manejo de estado global
- **React Navigation** - Navegación entre pantallas
- **React Native Paper** - Componentes UI con Material Design
- **React Native Maps** - Mapas y geolocalización
- **React Native Date Picker** - Selección de fechas y horas
- **Vector Icons** - Iconografía consistente

## 📱 Pantallas Principales

### Autenticación
- Pantalla de bienvenida
- Inicio de sesión
- Registro de usuario
- Selección de tipo de usuario (Buscador/Arrendador)

### Para Buscadores
- **Inicio**: Mapa con estacionamientos disponibles
- **Búsqueda**: Lista con filtros avanzados
- **Detalles**: Información completa del estacionamiento
- **Solicitar reserva**: Formulario con negociación de precio
- **Mis reservas**: Historial y reservas activas

### Para Arrendadores
- **Inicio**: Mapa con sus estacionamientos
- **Mis espacios**: Lista de estacionamientos propios
- **Agregar espacio**: Formulario para nuevos estacionamientos
- **Solicitudes**: Requests pendientes de aprobación
- **Estadísticas**: Ingresos y métricas

### Compartidas
- **Perfil**: Información personal y configuración
- **Chat**: Comunicación entre usuarios
- **Notificaciones**: Alertas y actualizaciones
- **Configuración**: Ajustes de la app

## 🏗 Arquitectura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── navigation/         # Configuración de navegación
├── screens/           # Pantallas de la aplicación
│   ├── auth/         # Autenticación
│   ├── booking/      # Reservas y solicitudes
│   ├── home/         # Pantalla principal
│   ├── parking/      # Gestión de estacionamientos
│   ├── profile/      # Perfil y configuración
│   └── search/       # Búsqueda y filtros
├── store/            # Redux store y slices
├── theme/            # Configuración de tema
└── types/            # Definiciones TypeScript
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 16+
- React Native CLI
- Android Studio (para Android)
- Xcode (para iOS)

### Instalación

1. **Clonar el repositorio**
```bash
git clone [repository-url]
cd parkdrive-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar para iOS**
```bash
cd ios && pod install && cd ..
```

4. **Ejecutar la aplicación**

Para Android:
```bash
npm run android
```

Para iOS:
```bash
npm run ios
```

## 🎯 Flujo de Uso

### Como Buscador:
1. Registrarse y seleccionar "Buscador de Estacionamiento"
2. Ver mapa con estacionamientos disponibles
3. Aplicar filtros según necesidades
4. Seleccionar un estacionamiento y ver detalles
5. Solicitar reserva con fecha, hora y precio propuesto
6. Esperar aprobación del arrendador
7. Una vez aceptado, dirigirse al lugar

### Como Arrendador:
1. Registrarse y seleccionar "Arrendador de Espacios"
2. Agregar información de su estacionamiento
3. Recibir solicitudes de reserva
4. Aceptar o rechazar según disponibilidad y precio
5. Proporcionar instrucciones de acceso
6. Confirmar llegada y salida del usuario

## 📋 Características del Sistema

### Negociación de Precios (Estilo inDrive)
- Los buscadores proponen un precio por hora
- Los arrendadores pueden aceptar, rechazar o contraproponerr
- Sistema de notificaciones en tiempo real
- Historial de negociaciones

### Sistema de Calificaciones
- Calificación bidireccional (buscador ↔ arrendador)
- Comentarios y reseñas
- Promedio de calificaciones visible en perfiles
- Insignias para usuarios verificados

### Geolocalización y Mapas
- Ubicación en tiempo real
- Cálculo de distancias
- Navegación GPS integrada
- Marcadores personalizados en el mapa

### Comunicación Integrada
- Chat en tiempo real entre usuarios
- Notificaciones push
- Historial de conversaciones
- Soporte técnico integrado

## 🔧 Configuración de Desarrollo

### Variables de Entorno
Crear archivo `.env` con:
```
GOOGLE_MAPS_API_KEY=tu_api_key_aqui
API_BASE_URL=https://api.parkdrive.com
```

### Datos Mock
La aplicación incluye datos de prueba para desarrollo:
- Usuarios demo
- Estacionamientos de ejemplo
- Solicitudes simuladas
- Historial de reservas

## 📱 Funcionalidades Futuras

- [ ] Pagos integrados (Stripe, PayPal)
- [ ] Reservas recurrentes
- [ ] Sistema de puntos y recompensas
- [ ] Integración con calendarios
- [ ] Reportes avanzados para arrendadores
- [ ] Soporte para estacionamientos comerciales
- [ ] API para terceros
- [ ] Aplicación web complementaria

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- Email: soporte@parkdrive.com
- Discord: [Servidor de la comunidad]
- Documentación: [docs.parkdrive.com]

---

**ParkDrive** - La forma más fácil de encontrar y ofrecer estacionamientos 🚗🅿️