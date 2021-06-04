import 'dotenv/config'
import sanityClient, {
  IdentifiedSanityDocumentStub,
  ProjectClientConfig
} from '@sanity/client'
import { createReadStream, readdirSync, readFileSync, ReadStream } from 'fs'
import { BinaryLike } from 'crypto'
import { ReadableStream } from 'memory-streams'
import { basename } from 'path'
import { DOCUMENTS_DIR, IMAGE_DIR, IMAGE_MAPPING_DIR } from './config'

// TODO: we can use something else to not wait for it to be loaded...
export class Migrator {
  private client

  constructor(sanityClientConfig: ProjectClientConfig) {
    /* eslint-disable new-cap */
    this.client = new sanityClient(sanityClientConfig)
  }

  async loadDocuments(filename: string | null) {
    try {
      await this.readAndSendDocuments(filename)
    } catch (e) {
      throw new Error(e)
    }
  }

  async loadImages(filename: string) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    let data: IdentifiedSanityDocumentStub<any>[] = []
    let rawData: BinaryLike
    let path: string

    try {
      readdirSync(IMAGE_MAPPING_DIR).forEach(async (file) => {
        path = IMAGE_MAPPING_DIR + file
        rawData = readFileSync(path)
        data = JSON.parse(rawData.toString())
        /* eslint-disable @typescript-eslint/no-explicit-any */
        data.forEach(async (item: IdentifiedSanityDocumentStub<any>) => {
          this.loadImageAndAttachToDocument(item)
        })
      })
    } catch (e) {
      throw new Error(e)
    }
  }

  async deleteDocuments(documentType: string) {
    const queryString = `*[_type == '${documentType}'][0...999]`

    try {
      const response = await this.client.delete({ query: queryString })
    } catch (e) {
      throw new Error(e)
    }
  }

  private async loadImageAndAttachToDocument(
    /* eslint-disable @typescript-eslint/no-explicit-any */
    item: IdentifiedSanityDocumentStub<any>
  ) {
    const { documentID } = item
    const imageFileName = item.imageFilename
    const fieldName = item.imageAttribute

    const filePath = IMAGE_DIR + imageFileName

    const readStream: ReadStream = createReadStream(filePath)
    const stream: ReadableStream = readStream as unknown as ReadableStream
    // eslint-disable-next-line
    // @ts-ignore
    const imageAsset: SanityImageAssetDocument =
      await this.client.assets.upload('image', stream, {
        filename: basename(filePath)
      })

    const patchResponse = await this.client
      .patch(documentID)
      .set({
        /* eslint-disable no-underscore-dangle */
        [fieldName]: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id
          }
        }
      })
      .commit()
  }

  private async readAndSendDocuments(filename: string | null) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    let data: IdentifiedSanityDocumentStub<any>[]
    let rawData: BinaryLike
    let path: string

    readdirSync(DOCUMENTS_DIR).forEach(async (file) => {
      const transaction = this.client.transaction()
      path = DOCUMENTS_DIR + file

      rawData = readFileSync(path)
      data = JSON.parse(rawData.toString())
      data.forEach(async (document) => {
        transaction.createOrReplace(document)
      })
      await transaction.commit()
    })
  }
}
