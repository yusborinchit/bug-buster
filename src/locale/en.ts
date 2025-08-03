export default {
  translation: {
    date: "{{date, datetime}}",
    bug: {
      singular: "Bug",
      plural: "Bugs"
    },
    question: {
      singular: "Question",
      plural: "Questions"
    },
    idea: {
      singular: "Idea",
      plural: "Ideas"
    },
    note: {
      singular: "Note",
      plural: "Notes"
    },
    home: {
      welcome: "Welcome to BugBuster!",
      title: "Manage Sessions",
      exportData: "Export Data",
      importData: "Import Data",
      enterSession: "Enter Session",
      deleteSession: "Delete Session",
      emptySessions:
        "Nothing to see here yet, create a session to get started.",
      sessionNamePlaceholder: "Your session name here...",
      createSession: "Create Session"
    },
    session: {
      goBack: "Go Back",
      title: "Session: {{name}}",
      enterForm: "Enter Form",
      downloadDocx: "Download as DOCX",
      downloadCsv: "Download as CSV"
    },
    form: {
      goBack: "Go Back",
      title: "Manage {{type}}",
      exitForm: "Exit Form",
      createNotationLabel: "Create {{type}}:",
      selectPriority: "Select Priority",
      lowPriority: "Low priority",
      mediumPriority: "Medium priority",
      highPriority: "High priority",
      selectSeverity: "Select severity",
      minorSeverity: "Minor severity",
      moderateSeverity: "Moderate severity",
      majorSeverity: "Major severity",
      criticalSeverity: "Critical severity",
      notationTitlePlaceholder: "Your {{type}} here...",
      screenshotsAttached: "Screenshots Attached",
      attachScreenshot: "Attach Screenshot",
      createNotation: "Create {{type}}",
      deleteNotationLabel: "Delete {{type}}:",
      selectNotation: "Select {{type}}",
      emptyNotations: "No {{type}} added yet",
      deleteNotation: "Delete {{type}}"
    },
    modal: {
      uploadError:
        "For security reasons, you can't upload screenshots from this tab (Or any other internal chrome tab).",
      goBack: "Go Back",
      title: "Attach Screenshots",
      uploadScreenshot: "Upload Screenshot",
      screenshotAlt: "Screenshot thumbnail",
      emptyScreenshots: "Upload some screenshots with the top-right button.",
      attachScreenshots: "Attach {{count}} Screenshots"
    },
    docx: {
      title: "{{sessionName}} Report",
      testers: "Tester/s:",
      date: "Date: {{date, datetime}}",
      tableOfContents: "Table of Contents",
      objective: "Objective",
      objectivePlaceholder: "Write the objective of this session here...",
      scope: "Scope",
      scopePlaceholder: "Write the scope of this session here...",
      description: "Description:",
      descriptionPlaceholder: "Your {{type}} description here...",
      characteristics: "Characteristics:",
      severity: "Severity: {{severity}}",
      priority: "Priority: {{priority}}",
      reproducibility: "Reproducibility:",
      type: "Type:",
      category: "Category:",
      extraInformation: "Extra Information:",
      environment: "Environment:",
      stepsToReproduce: "Steps to Reproduce:",
      screenshots: "Screenshots:",
      contentSummary: "Content Summary",
      tableType: "Type",
      tableCount: "Count",
      finalThoughts: "Final Thoughts",
      finalThoughtsPlaceholder: "Write your final thoughts here..."
    },
    csv: {
      headers: "Type,Title,Priority,Severity,Date",
      row: "{{type}},{{title}},{{priority}},{{severity}},{{date, datetime}}"
    }
  }
};
