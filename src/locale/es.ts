export default {
  translation: {
    bug: {
      singular: "Error",
      plural: "Errores"
    },
    question: {
      singular: "Pregunta",
      plural: "Preguntas"
    },
    idea: {
      singular: "Idea",
      plural: "Ideas"
    },
    note: {
      singular: "Nota",
      plural: "Notas"
    },
    home: {
      welcome: "¡Bienvenido a BugBuster!",
      title: "Gestionar Sesiones",
      exportData: "Exportar Datos",
      importData: "Importar Datos",
      enterSession: "Entrar a la Sesión",
      deleteSession: "Eliminar Sesión",
      emptySessions:
        "Todavía no hay nada para ver, crea una sesión para comenzar.",
      sessionNamePlaceholder: "Nombre de tu Sesión...",
      createSession: "Crear Sesión"
    },
    session: {
      goBack: "Volver",
      title: "Sesión: {{name}}",
      enterForm: "Entrar al Formulario",
      downloadDocx: "Descargar como DOCX"
    },
    form: {
      goBack: "Volver",
      title: "Gestionar {{type}}",
      exitForm: "Salir del Formulario",
      createNotationLabel: "Crear {{type}}:",
      selectPriority: "Seleccionar prioridad",
      lowPriority: "Prioridad baja",
      mediumPriority: "Prioridad media",
      highPriority: "Prioridad alta",
      selectSeverity: "Seleccionar severidad",
      minorSeverity: "Severidad menor",
      moderateSeverity: "Severidad moderada",
      majorSeverity: "Severidad alta",
      criticalSeverity: "Severidad crítica",
      notationTitlePlaceholder: "Tu {{type}} aquí...",
      screenshotsAttached: "Capturas Adjuntadas",
      attachScreenshot: "Adjuntar captura",
      createNotation: "Crear {{type}}",
      deleteNotationLabel: "Eliminar {{type}}:",
      selectNotation: "Seleccionar {{type}}",
      emptyNotations: "Aún no se agregó ningún {{type}}",
      deleteNotation: "Eliminar {{type}}"
    },
    modal: {
      uploadError:
        "Por razones de seguridad, no podés subir capturas desde esta pestaña (ni desde otras pestañas internas de Chrome).",
      goBack: "Volver",
      title: "Adjuntar Capturas",
      uploadScreenshot: "Subir Captura",
      screenshotAlt: "Miniatura de captura",
      emptyScreenshots:
        "Subí capturas con el botón de la esquina superior derecha.",
      attachScreenshots: "Adjuntar {{count}} Capturas"
    },
    docx: {
      title: "Informe de {{sessionName}}",
      testers: "Tester/s:",
      date: "Fecha: {{date, datetime}}",
      tableOfContents: "Índice",
      objective: "Objetivo",
      objectivePlaceholder: "Escribe el objetivo de esta sesión aquí...",
      scope: "Alcance",
      scopePlaceholder: "Escribe el alcance de esta sesión aquí...",
      description: "Descripción:",
      descriptionPlaceholder: "Escribe la descripción de tu {{type}} aquí...",
      characteristics: "Características:",
      severity: "Severidad: {{severity}}",
      priority: "Prioridad: {{priority}}",
      reproducibility: "Reproducibilidad:",
      type: "Tipo:",
      category: "Categoría:",
      extraInformation: "Información Extra:",
      environment: "Entorno:",
      stepsToReproduce: "Pasos para Reproducir:",
      screenshots: "Capturas:",
      contentSummary: "Resumen del Contenido",
      tableType: "Tipo",
      tableCount: "Cantidad",
      finalThoughts: "Conclusiones",
      finalThoughtsPlaceholder: "Escribe tus conclusiones finales aquí..."
    }
  }
};
