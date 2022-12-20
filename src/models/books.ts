import { Model } from 'src/models'

export enum SectionType {
  Trap = 'trap',
  Inline = 'inline'
}

export interface Section extends Model  {
  sectionIdx: number
  chapterIdx: number
  bookId: string
  trapId: string
  text: string
  type: SectionType
}

export interface Book extends Model {
  name: string
  author: string
  code: string
  description: string
  location: string
}

export const hashChapter = (chapter: Array<Section>) =>
  chapter.map(section => section.id).join('!')

export const sortSections = (sections: Array<Section>) => sections.sort((a, b) => {
  if (a.chapterIdx == b.chapterIdx) {
    return a.sectionIdx > b.sectionIdx ? 1 : -1
  }

  return a.chapterIdx > b.chapterIdx ? 1 : -1
})

export const groupSectionsByChapter = (sections: Array<Section>) => {
  const chapters: Array<Array<Section>> = []
  let currentChapter: Array<Section> = []
  sortSections(sections).forEach((section) => {
    if (chapters.length == 0) {
      currentChapter = [section]
      chapters.push(currentChapter)
    } 
    else if (currentChapter[currentChapter.length - 1].chapterIdx != section.chapterIdx) {
        currentChapter = [section]
        chapters.push(currentChapter)
    }
    else {
      currentChapter.push(section)
    }
  })
  
  return chapters
}
