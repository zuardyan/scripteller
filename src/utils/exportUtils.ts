import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import type { FountainScript, Scene, FountainElement } from './fountainParser';

// Export to Fountain (.fountain)
export const exportToFountain = (script: FountainScript): void => {
  let content = '';

  // Title page
  Object.entries(script.titlePage).forEach(([key, value]) => {
    content += `${key}: ${value}\n`;
  });
  content += '\n';

  // Scenes
  script.scenes.forEach((scene) => {
    scene.elements.forEach((element) => {
      switch (element.type) {
        case 'scene_heading':
          content += `${element.text}\n\n`;
          break;
        case 'action':
          content += `${element.text}\n\n`;
          break;
        case 'character':
          content += `${element.text}\n`;
          break;
        case 'dialogue':
          content += `${element.text}\n`;
          break;
        case 'parenthetical':
          content += `${element.text}\n`;
          break;
        case 'transition':
          content += `${element.text}\n\n`;
          break;
        case 'note':
          content += `[[${element.text}]]\n\n`;
          break;
      }
    });
    content += '\n';
  });

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${script.title.replace(/\s+/g, '_')}.fountain`);
};

// Export to Final Draft XML (.fdx)
export const exportToFDX = (script: FountainScript): void => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<FinalDraft DocumentType="Script" Template="No" Version="1">\n';

  // Title page
  xml += '  <Content>\n';
  xml += '    <Paragraph Type="Title">\n';
  xml += `      <Text>${escapeXml(script.title)}</Text>\n`;
  xml += '    </Paragraph>\n';
  xml += '    <Paragraph Type="Author">\n';
  xml += `      <Text>by ${escapeXml(script.author)}</Text>\n`;
  xml += '    </Paragraph>\n';

  // Scenes
  script.scenes.forEach((scene) => {
    scene.elements.forEach((element) => {
      switch (element.type) {
        case 'scene_heading':
          xml += '    <Paragraph Type="Scene Heading">\n';
          xml += `      <Text>${escapeXml(element.text)}</Text>\n`;
          xml += '    </Paragraph>\n';
          break;
        case 'action':
          xml += '    <Paragraph Type="Action">\n';
          xml += `      <Text>${escapeXml(element.text)}</Text>\n`;
          xml += '    </Paragraph>\n';
          break;
        case 'character':
          xml += '    <Paragraph Type="Character">\n';
          xml += `      <Text>${escapeXml(element.text)}</Text>\n`;
          xml += '    </Paragraph>\n';
          break;
        case 'dialogue':
          xml += '    <Paragraph Type="Dialogue">\n';
          xml += `      <Text>${escapeXml(element.text)}</Text>\n`;
          xml += '    </Paragraph>\n';
          break;
        case 'parenthetical':
          xml += '    <Paragraph Type="Parenthetical">\n';
          xml += `      <Text>${escapeXml(element.text)}</Text>\n`;
          xml += '    </Paragraph>\n';
          break;
        case 'transition':
          xml += '    <Paragraph Type="Transition">\n';
          xml += `      <Text>${escapeXml(element.text)}</Text>\n`;
          xml += '    </Paragraph>\n';
          break;
      }
    });
  });

  xml += '  </Content>\n';
  xml += '</FinalDraft>';

  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
  saveAs(blob, `${script.title.replace(/\s+/g, '_')}.fdx`);
};

// Export to PDF
export const exportToPDF = (script: FountainScript): void => {
  const doc = new jsPDF();
  let yPosition = 20;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const lineHeight = 7;

  // Title page
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(script.title, 105, yPosition, { align: 'center' });

  yPosition += 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(`by ${script.author}`, 105, yPosition, { align: 'center' });

  yPosition += 30;

  // Scenes
  doc.setFontSize(12);
  script.scenes.forEach((scene) => {
    scene.elements.forEach((element) => {
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }

      switch (element.type) {
        case 'scene_heading':
          doc.setFont('helvetica', 'bold');
          const sceneLines = doc.splitTextToSize(element.text.toUpperCase(), 170);
          doc.text(sceneLines, margin, yPosition);
          yPosition += lineHeight * sceneLines.length + 5;
          break;

        case 'action':
          doc.setFont('helvetica', 'normal');
          const actionLines = doc.splitTextToSize(element.text, 170);
          doc.text(actionLines, margin, yPosition);
          yPosition += lineHeight * actionLines.length + 5;
          break;

        case 'character':
          doc.setFont('helvetica', 'bold');
          doc.text(element.text.toUpperCase(), 95, yPosition);
          yPosition += lineHeight;
          break;

        case 'dialogue':
          doc.setFont('helvetica', 'normal');
          const dialogueLines = doc.splitTextToSize(element.text, 100);
          doc.text(dialogueLines, 60, yPosition);
          yPosition += lineHeight * dialogueLines.length;
          break;

        case 'parenthetical':
          doc.setFont('helvetica', 'italic');
          doc.text(element.text, 75, yPosition);
          yPosition += lineHeight;
          break;

        case 'transition':
          doc.setFont('helvetica', 'bold');
          doc.text(element.text.toUpperCase(), 140, yPosition);
          yPosition += lineHeight + 5;
          break;
      }
    });
  });

  doc.save(`${script.title.replace(/\s+/g, '_')}.pdf`);
};

// Export to HTML
export const exportToHTML = (script: FountainScript): void => {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(script.title)}</title>
  <style>
    body {
      font-family: 'Courier New', monospace;
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
      line-height: 1.6;
    }
    .title-page {
      text-align: center;
      margin-bottom: 60px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .author {
      font-size: 16px;
      margin-bottom: 5px;
    }
    .scene-heading {
      font-weight: bold;
      text-transform: uppercase;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    .action {
      margin-bottom: 10px;
    }
    .character {
      font-weight: bold;
      text-transform: uppercase;
      margin-left: 200px;
      margin-top: 10px;
    }
    .dialogue {
      margin-left: 100px;
      margin-right: 100px;
      margin-bottom: 5px;
    }
    .parenthetical {
      font-style: italic;
      margin-left: 150px;
    }
    .transition {
      font-weight: bold;
      text-align: right;
      text-transform: uppercase;
      margin-top: 15px;
      margin-bottom: 15px;
    }
  </style>
</head>
<body>
  <div class="title-page">
    <div class="title">${escapeHtml(script.title)}</div>
    <div class="author">by ${escapeHtml(script.author)}</div>
  </div>
`;

  script.scenes.forEach((scene) => {
    scene.elements.forEach((element) => {
      switch (element.type) {
        case 'scene_heading':
          html += `  <div class="scene-heading">${escapeHtml(element.text)}</div>\n`;
          break;
        case 'action':
          html += `  <div class="action">${escapeHtml(element.text)}</div>\n`;
          break;
        case 'character':
          html += `  <div class="character">${escapeHtml(element.text)}</div>\n`;
          break;
        case 'dialogue':
          html += `  <div class="dialogue">${escapeHtml(element.text)}</div>\n`;
          break;
        case 'parenthetical':
          html += `  <div class="parenthetical">${escapeHtml(element.text)}</div>\n`;
          break;
        case 'transition':
          html += `  <div class="transition">${escapeHtml(element.text)}</div>\n`;
          break;
      }
    });
  });

  html += `</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  saveAs(blob, `${script.title.replace(/\s+/g, '_')}.html`);
};

// Export to plain text
export const exportToTXT = (script: FountainScript): void => {
  let content = '';

  // Title page
  content += `${script.title}\n`;
  content += `by ${script.author}\n\n\n`;

  // Scenes
  script.scenes.forEach((scene) => {
    scene.elements.forEach((element) => {
      switch (element.type) {
        case 'scene_heading':
          content += `${element.text.toUpperCase()}\n\n`;
          break;
        case 'action':
          content += `${element.text}\n\n`;
          break;
        case 'character':
          content += `                    ${element.text.toUpperCase()}\n`;
          break;
        case 'dialogue':
          content += `          ${element.text}\n`;
          break;
        case 'parenthetical':
          content += `               ${element.text}\n`;
          break;
        case 'transition':
          content += `                                   ${element.text.toUpperCase()}\n\n`;
          break;
      }
    });
    content += '\n';
  });

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${script.title.replace(/\s+/g, '_')}.txt`);
};

// Export to CSV (Scene breakdown)
export const exportToCSV = (script: FountainScript): void => {
  let csv = 'Scene Number,Location,INT/EXT,Time of Day,Characters,Dialogue Lines,Action Lines\n';

  script.scenes.forEach((scene) => {
    const actionLines = scene.elements.filter(e => e.type === 'action').length;
    const characters = scene.characters.join('; ');

    csv += `${scene.sceneNumber},"${escapeCSV(scene.location)}","${scene.intExt}","${scene.timeOfDay}","${characters}",${scene.dialogueCount},${actionLines}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${script.title.replace(/\s+/g, '_')}_breakdown.csv`);
};

// Helper functions
const escapeXml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const escapeCSV = (text: string): string => {
  return text.replace(/"/g, '""');
};
