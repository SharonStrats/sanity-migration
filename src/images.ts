import 'dotenv/config'
import sanityClient, { IdentifiedSanityDocumentStub, ProjectClientConfig } from '@sanity/client'
import {basename} from 'path'
import {createReadStream, readdirSync, readFileSync, ReadStream } from 'fs'
import { ReadableStream } from 'memory-streams'

//import DIRECTORY from './config'
let data: IdentifiedSanityDocumentStub<any>[] 
let rawData
let path

const DIRECTORY = {
  IMAGE_MAPPING: './data/mapping/',
  IMAGE: './data/images/',
}

const sanityClientConfig: ProjectClientConfig = {
  projectId: process.env.SANITY_PROJECT || '6h71nmg1',
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  apiVersion: '2021-03-25',
  useCdn: false
}
const client = sanityClient(sanityClientConfig)

const loadData = async () => {
  try {
  readdirSync(DIRECTORY.IMAGE_MAPPING).forEach(async (file) => {
   
    path = DIRECTORY.IMAGE_MAPPING + file
  
    rawData = readFileSync(path, 'utf8')
    const dataArray = rawData.split('\n')
    dataArray.forEach( async (row) => {
        const recordArray = row.split(',')
        const documentID = recordArray[0]
        const imageFileName = recordArray[1]
        const fieldName = recordArray[2]
    
        const filePath = DIRECTORY.IMAGE + imageFileName
        const readStream: ReadStream = createReadStream(filePath);
        const stream: ReadableStream = (readStream as unknown) as ReadableStream;
        client.assets
          .upload('image', stream, {
            filename: basename(filePath)
          }) 
        .then(imageAsset => {
            // Here you can decide what to do with the returned asset document. 
            // If you want to set a specific asset field you can to the following:
            return client
              .patch(documentID)
              .set({
                [fieldName]: {
                  _type: 'image',
                  asset: {
                    _type: "reference",
                    _ref: imageAsset._id
                  }
                }
              })
              .commit() // this commit may need to only get added to last one
          })
          .then(() => {
            console.log("Done!");
          })
        })
    })
  } catch(e) {
    console.log(e)
  } finally {

  }
}

loadData()
