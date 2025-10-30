export interface FountainElement {
  type: 'title_page' | 'scene_heading' | 'action' | 'character' | 'dialogue' | 'parenthetical' | 'transition' | 'note' | 'section' | 'synopsis' | 'page_break';
  text: string;
  lineNumber: number;
}

export interface Scene {
  id: string;
  sceneNumber: number;
  heading: string;
  location: string;
  timeOfDay: string;
  intExt: 'INT' | 'EXT' | 'INT./EXT.' | 'I/E' | '';
  elements: FountainElement[];
  characters: string[];
  dialogueCount: number;
  duration?: number;
}

export interface Character {
  name: string;
  scenes: number[];
  dialogueLines: number;
}

export interface FountainScript {
  title: string;
  author: string;
  titlePage: Record<string, string>;
  scenes: Scene[];
  characters: Map<string, Character>;
  totalScenes: number;
}

export class FountainParser {
  private lines: string[];
  private currentLine: number;

  constructor(content: string) {
    this.lines = content.split('\n');
    this.currentLine = 0;
  }

  parse(): FountainScript {
    const titlePage = this.parseTitlePage();
    const elements = this.parseElements();
    const scenes = this.groupIntoScenes(elements);
    const characters = this.extractCharacters(scenes);

    return {
      title: titlePage.Title || 'Untitled',
      author: titlePage.Author || titlePage['Authors'] || 'Unknown',
      titlePage,
      scenes,
      characters,
      totalScenes: scenes.length,
    };
  }

  private parseTitlePage(): Record<string, string> {
    const titlePage: Record<string, string> = {};
    let inTitlePage = true;

    while (this.currentLine < this.lines.length && inTitlePage) {
      const line = this.lines[this.currentLine].trim();

      if (line === '') {
        const nextNonEmpty = this.findNextNonEmptyLine();
        if (nextNonEmpty && !nextNonEmpty.includes(':')) {
          inTitlePage = false;
          break;
        }
      } else if (line.includes(':')) {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();
        titlePage[key.trim()] = value;
      } else if (!line.match(/^(INT|EXT|INT\.\/EXT|I\/E)/i)) {
        // Continue reading multi-line values
        const lastKey = Object.keys(titlePage).pop();
        if (lastKey) {
          titlePage[lastKey] += ' ' + line;
        }
      } else {
        inTitlePage = false;
        break;
      }

      this.currentLine++;
    }

    return titlePage;
  }

  private findNextNonEmptyLine(): string | null {
    for (let i = this.currentLine + 1; i < this.lines.length; i++) {
      const line = this.lines[i].trim();
      if (line !== '') return line;
    }
    return null;
  }

  private parseElements(): FountainElement[] {
    const elements: FountainElement[] = [];

    while (this.currentLine < this.lines.length) {
      const line = this.lines[this.currentLine];
      const trimmed = line.trim();

      if (trimmed === '') {
        this.currentLine++;
        continue;
      }

      // Scene Heading
      if (this.isSceneHeading(trimmed)) {
        elements.push({
          type: 'scene_heading',
          text: trimmed,
          lineNumber: this.currentLine,
        });
      }
      // Section
      else if (trimmed.startsWith('#')) {
        elements.push({
          type: 'section',
          text: trimmed.replace(/^#+\s*/, ''),
          lineNumber: this.currentLine,
        });
      }
      // Synopsis
      else if (trimmed.startsWith('=')) {
        elements.push({
          type: 'synopsis',
          text: trimmed.substring(1).trim(),
          lineNumber: this.currentLine,
        });
      }
      // Note
      else if (trimmed.startsWith('[[') && trimmed.endsWith(']]')) {
        elements.push({
          type: 'note',
          text: trimmed.slice(2, -2),
          lineNumber: this.currentLine,
        });
      }
      // Page Break
      else if (trimmed === '===') {
        elements.push({
          type: 'page_break',
          text: '',
          lineNumber: this.currentLine,
        });
      }
      // Transition
      else if (this.isTransition(trimmed)) {
        elements.push({
          type: 'transition',
          text: trimmed,
          lineNumber: this.currentLine,
        });
      }
      // Character
      else if (this.isCharacter(trimmed, this.lines[this.currentLine - 1])) {
        elements.push({
          type: 'character',
          text: trimmed,
          lineNumber: this.currentLine,
        });

        // Check for dialogue and parentheticals
        this.currentLine++;
        while (this.currentLine < this.lines.length) {
          const nextLine = this.lines[this.currentLine].trim();

          if (nextLine === '') break;

          if (nextLine.startsWith('(') && nextLine.endsWith(')')) {
            elements.push({
              type: 'parenthetical',
              text: nextLine,
              lineNumber: this.currentLine,
            });
          } else if (!this.isSceneHeading(nextLine) && !this.isCharacter(nextLine, this.lines[this.currentLine - 1])) {
            elements.push({
              type: 'dialogue',
              text: nextLine,
              lineNumber: this.currentLine,
            });
          } else {
            this.currentLine--;
            break;
          }

          this.currentLine++;
        }
      }
      // Action
      else {
        elements.push({
          type: 'action',
          text: trimmed,
          lineNumber: this.currentLine,
        });
      }

      this.currentLine++;
    }

    return elements;
  }

  private isSceneHeading(line: string): boolean {
    const sceneHeadingPattern = /^(INT|EXT|INT\.\/EXT|I\/E|INT\/EXT|INTERIOR|EXTERIOR)[\.\s]/i;
    return sceneHeadingPattern.test(line) || line.startsWith('.');
  }

  private isCharacter(line: string, prevLine: string): boolean {
    // Character names are all caps and preceded by empty line
    const isAllCaps = line === line.toUpperCase() && /[A-Z]/.test(line);
    const notSceneHeading = !this.isSceneHeading(line);
    const notTransition = !line.endsWith('TO:');
    const prevLineEmpty = !prevLine || prevLine.trim() === '';

    return isAllCaps && notSceneHeading && notTransition && prevLineEmpty;
  }

  private isTransition(line: string): boolean {
    return (line === line.toUpperCase() && line.endsWith('TO:')) ||
           line.startsWith('>') ||
           /^(FADE IN|FADE OUT|FADE TO BLACK|CUT TO|DISSOLVE TO):/i.test(line);
  }

  private groupIntoScenes(elements: FountainElement[]): Scene[] {
    const scenes: Scene[] = [];
    let currentScene: Scene | null = null;
    let sceneNumber = 0;

    for (const element of elements) {
      if (element.type === 'scene_heading') {
        if (currentScene) {
          scenes.push(currentScene);
        }

        sceneNumber++;
        const headingInfo = this.parseSceneHeading(element.text);

        currentScene = {
          id: `scene-${sceneNumber}`,
          sceneNumber,
          heading: element.text,
          location: headingInfo.location,
          timeOfDay: headingInfo.timeOfDay,
          intExt: headingInfo.intExt,
          elements: [element],
          characters: [],
          dialogueCount: 0,
        };
      } else if (currentScene) {
        currentScene.elements.push(element);

        if (element.type === 'character') {
          const charName = this.cleanCharacterName(element.text);
          if (!currentScene.characters.includes(charName)) {
            currentScene.characters.push(charName);
          }
        } else if (element.type === 'dialogue') {
          currentScene.dialogueCount++;
        }
      }
    }

    if (currentScene) {
      scenes.push(currentScene);
    }

    return scenes;
  }

  private parseSceneHeading(heading: string): { intExt: Scene['intExt'], location: string, timeOfDay: string } {
    const cleaned = heading.replace(/^\./, '').trim();

    let intExt: Scene['intExt'] = '';
    let location = '';
    let timeOfDay = '';

    const intExtMatch = cleaned.match(/^(INT|EXT|INT\.\/EXT|I\/E|INT\/EXT)/i);
    if (intExtMatch) {
      const matched = intExtMatch[1].toUpperCase();
      if (matched === 'INT') intExt = 'INT';
      else if (matched === 'EXT') intExt = 'EXT';
      else intExt = 'INT./EXT.';
    }

    const rest = cleaned.replace(/^(INT|EXT|INT\.\/EXT|I\/E|INT\/EXT)[\.\s]*/i, '');
    const parts = rest.split('-').map(p => p.trim());

    if (parts.length >= 1) {
      location = parts[0];
    }
    if (parts.length >= 2) {
      timeOfDay = parts[parts.length - 1];
    }

    return { intExt, location, timeOfDay };
  }

  private cleanCharacterName(name: string): string {
    return name
      .replace(/\^$/, '') // Remove dual dialogue marker
      .replace(/\(.*?\)/, '') // Remove parentheticals in name
      .trim();
  }

  private extractCharacters(scenes: Scene[]): Map<string, Character> {
    const charactersMap = new Map<string, Character>();

    scenes.forEach(scene => {
      scene.characters.forEach(charName => {
        if (!charactersMap.has(charName)) {
          charactersMap.set(charName, {
            name: charName,
            scenes: [],
            dialogueLines: 0,
          });
        }

        const character = charactersMap.get(charName)!;
        character.scenes.push(scene.sceneNumber);
      });

      // Count dialogue lines
      let currentCharacter: string | null = null;
      scene.elements.forEach(element => {
        if (element.type === 'character') {
          currentCharacter = this.cleanCharacterName(element.text);
        } else if (element.type === 'dialogue' && currentCharacter) {
          const character = charactersMap.get(currentCharacter);
          if (character) {
            character.dialogueLines++;
          }
        }
      });
    });

    return charactersMap;
  }
}

export const parseFountain = (content: string): FountainScript => {
  const parser = new FountainParser(content);
  return parser.parse();
};
