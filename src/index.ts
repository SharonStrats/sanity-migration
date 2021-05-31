import 'dotenv/config'
import sanityClient, { IdentifiedSanityDocumentStub, ProjectClientConfig } from '@sanity/client'
import { readdirSync, readFileSync } from 'fs'
let data: IdentifiedSanityDocumentStub<any>[] 
let rawData
let path

const DIRECTORY = {
  DOCUMENTS: './data/documents/'
}

const sanityClientConfig: ProjectClientConfig = {
  projectId: process.env.SANITY_PROJECT || '6h71nmg1',
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  apiVersion: '2021-03-25',
  useCdn: false
}
const client = new sanityClient(sanityClientConfig)

const loadData = async () => {
  try {
  readdirSync(DIRECTORY.DOCUMENTS).forEach(async (file) => {
    const transaction = client.transaction()
    path = DIRECTORY.DOCUMENTS  + file
  
    rawData = readFileSync(path)
    data = JSON.parse(rawData.toString('utf8'))
    data.forEach(async (document: IdentifiedSanityDocumentStub<any>) =>
    { transaction.createOrReplace(document)
    }) 
    await transaction.commit()
  })
  } catch(e) {
    console.log(e)
  } finally {

  }

}
loadData()


