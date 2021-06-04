import 'dotenv/config'
import { ProjectClientConfig } from '@sanity/client'
import prompts, { PromptObject } from 'prompts'
import { Migrator } from './Migrator'

let interval: NodeJS.Timeout

// TODO: can expand to allow processing of a single file

const questions: PromptObject<string>[] = [
  {
    type: 'text',
    name: 'action',
    message: 'Please enter load or delete DELETE ONLY FOR DOCUMENTS',
    validate: (value: string) =>
      /^load|delete/.test(value) ? true : 'Only enter load or delete'
  },
  {
    type: 'text',
    name: 'type',
    message: 'Please enter documents or images DELETE ONLY FOR DOCUMENTS',
    validate: (value: string) =>
      /^documents|images/.test(value)
        ? true
        : 'Only enter documents or images IMAGES LOAD ONLY'
  },
  {
    type: 'text',
    name: 'object',
    message:
      'Enter Document Type to Delete if Delete was selected, otherwise hit ENTER'
  }
]
const cleanup = () => {
  clearInterval(interval)
}

const sanityClientConfig: ProjectClientConfig = {
  projectId: process.env.SANITY_PROJECT || '6h71nmg1',
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  apiVersion: '2021-03-25',
  useCdn: false
}

const migrateData = async () => {
  const { action, type, object } = await prompts(questions, {
    onCancel: cleanup,
    onSubmit: cleanup
  })

  if (action === 'delete' && type === 'images')
    throw new Error('Images can not be deleted now.')
  if (action === 'delete' && !object)
    throw new Error('Document type is required for delete')
  const migrator: Migrator = new Migrator(sanityClientConfig)

  // TODO: can use object as a filename to process one file only later
  if (action === 'load' && type === 'documents') migrator.loadDocuments(object)
  if (action === 'load' && type === 'images') migrator.loadImages(object)
  if (action === 'delete' && type === 'documents')
    migrator.deleteDocuments(object)
}

const run = async () => {
  try {
    await migrateData()
  } catch (e) {
    console.log(e)
  }
}

run()
