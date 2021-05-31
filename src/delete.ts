import 'dotenv/config'
import sanityClient, { IdentifiedSanityDocumentStub, ProjectClientConfig, SanityClient } from '@sanity/client'

const sanityClientConfig: ProjectClientConfig = {
  projectId: process.env.SANITY_PROJECT || '6h71nmg1',
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  apiVersion: '2021-03-25',
  useCdn: false
}
const client = new sanityClient(sanityClientConfig)
const deleteDocuments = (documentType: string) => {
const queryString = `*[_type == '${documentType}'][0...999]`
console.log(queryString)
client
  .delete({query: queryString})
  .then(console.log)
  .catch(console.error)
}
  deleteDocuments('product')