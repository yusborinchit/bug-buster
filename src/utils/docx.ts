import {
  Document,
  ImageRun,
  Paragraph,
  Table,
  TableCell,
  TableOfContents,
  TableRow,
  TextRun,
  type ISectionOptions
} from "docx";
import type { Notation } from "~/hooks/use-notation";
import type { Screenshot } from "~/hooks/use-screenshot";
import type { Session } from "~/hooks/use-session";
import i18n from "~/i18n";
import {
  DEFAULT_DOC_LIST_STYLES,
  DEFAULT_DOC_STYLES,
  DOC_WIDTH,
  LIST_STYLE_NAME
} from "../const";
import { getDocxImageSize } from "./get-docx-image-size";

export function createReportDoc(
  session: Session,
  notations: Notation[],
  screenshots: Screenshot[]
) {
  const bugs = notations.filter((n) => n.type === "bug");
  const questions = notations.filter((n) => n.type === "question");
  const ideas = notations.filter((n) => n.type === "idea");

  const doc = new Document({
    styles: DEFAULT_DOC_STYLES,
    numbering: DEFAULT_DOC_LIST_STYLES,
    sections: [
      createCoverPage(session.name, session.createdAt),
      createTableOfContentsPage(),
      createObjectiveAndScopePage(),
      ...createNotationsPage(bugs, screenshots, i18n.t("bug.plural")),
      ...createNotationsPage(questions, screenshots, i18n.t("question.plural")),
      ...createNotationsPage(ideas, screenshots, i18n.t("idea.plural")),
      createSummaryPage(bugs, questions, ideas),
      createConclusionPage()
    ]
  });

  return doc;
}

export function createCoverPage(
  sessionName: string,
  date: string
): ISectionOptions {
  return {
    properties: {
      type: "nextPage"
    },
    children: [
      new Paragraph({
        alignment: "center",
        heading: "Heading1",
        spacing: { before: 3000, after: 3000 },
        children: [new TextRun(i18n.t("docx.title", { sessionName }))]
      }),
      new Paragraph(i18n.t("docx.testers")),
      new Paragraph(i18n.t("docx.date", { date: new Date(date) }))
    ]
  };
}

export function createTableOfContentsPage(): ISectionOptions {
  return {
    properties: {
      type: "nextPage"
    },
    children: [
      new TableOfContents(i18n.t("docx.tableOfContents"), {
        hyperlink: true,
        headingStyleRange: "1-5"
      })
    ]
  };
}

export function createObjectiveAndScopePage(): ISectionOptions {
  return {
    properties: {
      type: "nextPage"
    },
    children: [
      new Paragraph({
        heading: "Heading2",
        children: [new TextRun(i18n.t("docx.objective"))]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: i18n.t("docx.objectivePlaceholder"),
            break: 1
          })
        ]
      }),
      new Paragraph({
        heading: "Heading2",
        children: [new TextRun({ text: i18n.t("docx.scope"), break: 1 })]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: i18n.t("docx.scopePlaceholder"),
            break: 1
          })
        ]
      })
    ]
  };
}

export function createNotationsPage(
  notations: Notation[],
  screenshots: Screenshot[],
  title: string
): ISectionOptions[] {
  return notations.map((notation, idx) => ({
    properties: {
      type: "nextPage"
    },
    children: [
      idx === 0
        ? new Paragraph({
            heading: "Heading2",
            children: [new TextRun({ text: title })]
          })
        : null,
      new Paragraph({
        heading: "Heading3",
        children: [new TextRun({ text: notation.title, break: title ? 1 : 0 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: `ID: ${notation.id}`, break: 1 })]
      }),
      new Paragraph({
        children: [
          new TextRun(
            i18n.t("docx.date", { date: new Date(notation.createdAt) })
          )
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: i18n.t("docx.description"),
            break: 1
          })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun(
            i18n.t("docx.descriptionPlaceholder", { type: notation.type })
          )
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: i18n.t("docx.characteristics"),
            break: 1
          })
        ]
      }),
      new Paragraph({
        numbering: { reference: LIST_STYLE_NAME, level: 0 },
        children: [
          new TextRun({
            text: notation.severity
              ? i18n.t("docx.severity", {
                  severity: i18n.t(`form.${notation.severity}Severity`)
                })
              : ""
          })
        ]
      }),
      new Paragraph({
        numbering: { reference: LIST_STYLE_NAME, level: 0 },
        children: [
          new TextRun({
            text: notation.priority
              ? i18n.t("docx.priority", {
                  priority: i18n.t(`form.${notation.priority}Priority`)
                })
              : ""
          })
        ]
      }),
      new Paragraph({
        numbering: { reference: LIST_STYLE_NAME, level: 0 },
        children: [new TextRun(i18n.t("docx.reproducibility"))]
      }),
      new Paragraph({
        numbering: { reference: LIST_STYLE_NAME, level: 0 },
        children: [new TextRun(i18n.t("docx.type"))]
      }),
      new Paragraph({
        numbering: { reference: LIST_STYLE_NAME, level: 0 },
        children: [new TextRun(i18n.t("docx.category"))]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: i18n.t("docx.extraInformation"),
            break: 1
          })
        ]
      }),
      new Paragraph({
        numbering: { reference: LIST_STYLE_NAME, level: 0 },
        children: [new TextRun({ text: i18n.t("docx.environment") })]
      }),
      new Paragraph({
        numbering: { reference: LIST_STYLE_NAME, level: 0 },
        children: [new TextRun({ text: i18n.t("docx.stepsToReproduce") })]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: i18n.t("docx.screenshots"),
            break: 1
          })
        ]
      }),
      ...notation.screenshotsIds
        .map((id) => screenshots.find((s) => s.id === id))
        .map(
          (s) =>
            new Paragraph({
              children: [
                new ImageRun({
                  data: s.url,
                  type: "png",
                  transformation: getDocxImageSize(s.width, s.height)
                })
              ]
            })
        )
    ].filter(Boolean)
  }));
}

export function createSummaryPage(
  bug: Notation[],
  question: Notation[],
  idea: Notation[]
): ISectionOptions {
  return {
    properties: {
      type: "nextPage"
    },
    children: [
      new Paragraph({
        heading: "Heading2",
        children: [new TextRun(i18n.t("docx.contentSummary"))]
      }),
      new Paragraph({ children: [] }),
      new Table({
        columnWidths: [DOC_WIDTH / 2, DOC_WIDTH / 2],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                margins: { top: 200, bottom: 200, left: 200, right: 200 },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: i18n.t("docx.tableType"),
                        bold: true
                      })
                    ]
                  })
                ]
              }),
              new TableCell({
                margins: { top: 200, bottom: 200, left: 200, right: 200 },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: i18n.t("docx.tableCount"),
                        bold: true
                      })
                    ]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                margins: { top: 200, bottom: 200, left: 200, right: 200 },
                children: [new Paragraph(i18n.t("bug.plural"))]
              }),
              new TableCell({
                margins: { top: 200, bottom: 200, left: 200, right: 200 },
                children: [new Paragraph(`${bug.length}`)]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                margins: { top: 200, bottom: 200, left: 200, right: 200 },
                children: [new Paragraph(`... ${i18n.t("form.highPriority")}`)]
              }),
              new TableCell({
                margins: { top: 200, bottom: 200, left: 200, right: 200 },
                children: [
                  new Paragraph(
                    `${bug.filter((b) => b.priority === "high").length}`
                  )
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                margins: { top: 200, bottom: 200, left: 200, right: 200 },
                children: [
                  new Paragraph(`... ${i18n.t("form.mediumPriority")}`)
                ]
              }),
              new TableCell({
                margins: { top: 200, bottom: 200, left: 200, right: 200 },
                children: [
                  new Paragraph(
                    `${bug.filter((b) => b.priority === "medium").length}`
                  )
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                margins: { top: 200, bottom: 200, left: 200, right: 200 },
                children: [new Paragraph(`... ${i18n.t("form.lowPriority")}`)]
              }),
              new TableCell({
                margins: { top: 200, bottom: 200, left: 200, right: 200 },
                children: [
                  new Paragraph(
                    `${bug.filter((b) => b.priority === "low").length}`
                  )
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                margins: { top: 200, bottom: 200, left: 200, right: 200 },
                children: [new Paragraph(i18n.t("question.plural"))]
              }),
              new TableCell({
                margins: { top: 200, bottom: 200, left: 200, right: 200 },
                children: [new Paragraph(`${question.length}`)]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                margins: { top: 200, bottom: 200, left: 200, right: 200 },
                children: [new Paragraph(i18n.t("idea.plural"))]
              }),
              new TableCell({
                margins: { top: 200, bottom: 200, left: 200, right: 200 },
                children: [new Paragraph(`${idea.length}`)]
              })
            ]
          })
        ]
      })
    ]
  };
}

export function createConclusionPage(): ISectionOptions {
  return {
    properties: {
      type: "nextPage"
    },
    children: [
      new Paragraph({
        heading: "Heading2",
        children: [new TextRun(i18n.t("docx.finalThoughts"))]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: i18n.t("docx.finalThoughtsPlaceholder"),
            break: 1
          })
        ]
      })
    ]
  };
}
