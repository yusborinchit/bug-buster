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
import { DEFAULT_DOC_STYLES, DOC_WIDTH } from "../const";
import { getCapitalizedString } from "./get-capitalized-string";
import { getDocxImageSize } from "./get-docx-image-size";

export function createReportDoc(
  notations: Notation[],
  screenshots: Screenshot[]
) {
  const { bug, question, idea } = notations.reduce(
    (acc, val) => {
      acc[val.type].push(val);
      return acc;
    },
    { bug: [], note: [], question: [], idea: [] } as Record<
      Notation["type"],
      Notation[]
    >
  );

  const doc = new Document({
    styles: DEFAULT_DOC_STYLES,
    sections: [
      createCoverPage(),
      createTableOfContentsPage(),
      createObjectiveAndScopePage(),
      ...createNotationsPage(bug, screenshots, "Issues"),
      ...createNotationsPage(question, screenshots, "Questions"),
      ...createNotationsPage(idea, screenshots, "Ideas"),
      createSummaryPage(bug, question, idea),
      createConclusionPage()
    ]
  });

  return doc;
}

export function createCoverPage(): ISectionOptions {
  return {
    properties: {
      type: "nextPage"
    },
    children: [
      new Paragraph({
        alignment: "center",
        heading: "Heading1",
        spacing: { before: 3000, after: 3000 },
        children: [new TextRun("Report Title")]
      }),
      new Paragraph("Tester/s:"),
      new Paragraph("Date:")
    ]
  };
}

export function createTableOfContentsPage(): ISectionOptions {
  return {
    properties: {
      type: "nextPage"
    },
    children: [
      new TableOfContents("Table of Contents", {
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
        children: [new TextRun("Objective")]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Your report objective here...",
            break: 1
          })
        ]
      }),
      new Paragraph({
        heading: "Heading2",
        children: [new TextRun({ text: "Scope", break: 1 })]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Your report scope here...",
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
        children: [new TextRun({ text: `Report ID: ${notation.id}`, break: 1 })]
      }),
      new Paragraph({
        children: [
          new TextRun(
            `Date: ${new Date(notation.createdAt).toLocaleString("es-UY")}`
          )
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Description:",
            break: 1
          })
        ]
      }),
      new Paragraph({ children: [new TextRun("Your description here...")] }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Characteristics:",
            break: 1
          })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `- Severity: ${getCapitalizedString(notation?.severity)}`
          })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun(`- Priority: ${getCapitalizedString(notation?.priority)}`)
        ]
      }),
      new Paragraph({ children: [new TextRun("- Reproducibility:")] }),
      new Paragraph({ children: [new TextRun("- Type:")] }),
      new Paragraph({ children: [new TextRun("- Category:")] }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Extra Information:",
            break: 1
          })
        ]
      }),
      new Paragraph({ children: [new TextRun({ text: "- Environment:" })] }),
      new Paragraph({
        children: [new TextRun({ text: "- Steps to Reproduce:" })]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Screenshots:",
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
        children: [new TextRun("Content Summary")]
      }),
      new Paragraph({
        children: []
      }),
      new Table({
        columnWidths: [DOC_WIDTH / 2, DOC_WIDTH / 2],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                margins: { top: 200, bottom: 200, left: 200, right: 200 },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: "Type", bold: true })]
                  })
                ]
              }),
              new TableCell({
                margins: { top: 200, bottom: 200, left: 200, right: 200 },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: "Count", bold: true })]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                margins: { top: 200, bottom: 200, left: 200, right: 200 },
                children: [new Paragraph("Issues")]
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
                children: [new Paragraph("... High Priority")]
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
                children: [new Paragraph("... Medium Priority")]
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
                children: [new Paragraph("... Low Priority")]
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
                children: [new Paragraph("Questions")]
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
                children: [new Paragraph("Ideas")]
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
        children: [new TextRun("Final Thoughts")]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Your final thoughts here...",
            break: 1
          })
        ]
      })
    ]
  };
}
