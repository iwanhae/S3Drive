enum FileOperation {
  upload,
  move,
  copy
}
interface FileTaskInterface {
  type: FileOperation
  path: String
  file?: File
  key?: String
}

interface FileSystemEntry {
  isDirectory: boolean
  isFile: boolean
  name: string
  fullPath: string
  file(resolve: Function, reject: Function): void
  createReader(): any
}
async function getFile(fileEntry: FileSystemEntry): Promise<File> {
  return await new Promise((resolve, reject) => fileEntry.file(resolve, reject))
}
async function getEntries(directoryReader: any): Promise<any> {
  return await new Promise((resolve, reject) =>
    directoryReader.readEntries(resolve, reject)
  )
}
async function scanItems(item: FileSystemEntry): Promise<FileTaskInterface[]> {
  const output: FileTaskInterface[] = []
  if (item.isFile) {
    output.push({
      type: FileOperation.upload,
      path: item.fullPath,
      file: await getFile(item)
    })
  } else if (item.isDirectory) {
    const directoryReader = item.createReader()
    const entries = await getEntries(directoryReader)
    for (const entry of entries) {
      output.push(...(await scanItems(entry)))
    }
  }
  return output
}

async function handleDrop(event: DragEvent): Promise<FileTaskInterface[]> {
  const output: FileTaskInterface[] = []

  const dt = event.dataTransfer
  const items = dt?.items
  const files = dt?.files
  if (items) {
    for (let i = 0; i < items.length; i++) {
      const item: FileSystemEntry = items[i].webkitGetAsEntry()
      if (item) {
        output.push(...(await scanItems(item)))
      }
    }
  } else if (files) {
    for (let i = 0; i < files.length; i++) {
      output.push({
        type: FileOperation.upload,
        path: files[i].name,
        file: files[i]
      })
    }
  }
  return output
}

function blockDefaulBehavior(event: DragEvent) {
  event.stopPropagation()
  event.preventDefault()
}
export { handleDrop, blockDefaulBehavior }
