# Sanity Migration

## Loading Documents and Assets

The first thing you need to do is to load the documents. This is because later you will need the document id in order to attach the image to the document.

### Setup

Before you go any further see the .env.example file. Create a .env file of your own and copy the .env.example into your own .env file with your specific values.

Note: You can view examples in the directories listed below to get a better idea of what your files should look like.

1. Create one json file for each document type (schema you created in studio). Place these files in the data/document directory. (Note: This is a recommendation for organisation, the program will load every file regardless of the file they are in.)
   **Important** file sizes need to be kept at 4MB or less. This is do to the API Limit shown here https://www.sanity.io/docs/technical-limits.

2. Images should be placed in the data/images directory.

3. Create mapping files to be used when loading the images. This will tell the program which document to attach the image to when loading.

### Process Files

To run migration

    yarn start

This will take you through a series of prompts.

Note: At this time you can NOT delete images. We can add this in the future.

## Publishing Documents

Unfortunately at this point in time once you load all your documents and assets you still need to publish them individually. See this Open Issue in Sanity https://github.com/sanity-io/sanity/issues/2239.

## Delete documents from a schema type

You need to specify a Document Type to delete.

    yarn start

Select delete, then documents, then enter the Document Type for the documents you want to delete.

### Detailed Implementation Information

Below is the code that will delete, the [0...999] is simply how many documents to delete. If you don't have this nothing gets deleted.

    const client = new sanityClient(sanityClientConfig)
    const deleteDocuments = (documentType: string) => {
    const queryString = `*[_type == '${documentType}'][0...999]`
    client
      .delete({query: queryString})
      .then(console.log)
      .catch(console.error)
    }

## Some Useful Information

The following are some things they may help. There are ways to export and import via the cli. How to do this is listed below. If you need more information you can see the docs If the commands below aren't enough see https://www.sanity.io/docs/migrating-data.

Also, you can find the response returned when uploading an image, this shows you the data stored for an asset.

### Export

Data can be exported from sanity using the following command

    sanity dataset export [NAME] [DESTINATION]

To get help type the command below

    sanity dataset export --help

or to export only specific types use
sanity dataset export --types

Once you have exported the data on MacOS you can unzip it by typing. You should be in the directory of the tar.gz when you execute the command below.

     gunzip -c development.tar.gz | tar xopf -

### Import

The data can be imported as well using the command

    sanity dataset import [FILE | FOLDER | URL] [TRAGET_DATASET]

Use replace command below if you get duplicate id errors.

    --replace

### Example of Image after importing

    {

    \_createdAt: '2021-05-30T04:28:15Z',
    \_id: 'image-038d4d117f0b84d5b6449ddcb5bbcfeeee15dcf6-768x1024-jpg',
    \_rev: '8f03VuN6e2qzPwKBY1coES',
    \_type: 'sanity.imageAsset',
    \_updatedAt: '2021-05-30T05:31:22Z',
    assetId: '038d4d117f0b84d5b6449ddcb5bbcfeeee15dcf6',
    extension: 'jpg',
    metadata: {
    \_type: 'sanity.imageMetadata',
    dimensions: {
    \_type: 'sanity.imageDimensions',
    aspectRatio: 0.75,
    height: 1024,
    width: 768
    },
    hasAlpha: false,
    isOpaque: true,
    lqip: 'data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAbABQDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAUHAgT/xAAkEAABBAIBBAMBAQAAAAAAAAABAgMEBQARBhIhIjEHE1EyQf/EABcBAQEBAQAAAAAAAAAAAAAAAAQDAQL/xAAbEQEAAgMBAQAAAAAAAAAAAAABAAIDERJBE//aAAwDAQACEQMRAD8AZQeTU08vR3qx5mU23vxX4kaxa2pmXLZXXF9COk9SHDtOh7yaxeUiJLkKrmFupXpICjs7HreU/wCFVM3i5z85sM7UWXEJP87/ADDc3WLLYq1fWcpahy9OtSFBHoDoPbDM8moJtVezIsSz6mEr2j7FaIB/zDI2qbYfuTLh9pW06pbNtDKnHPThHcZQPhunuGeVdYadRXzHQ62VHssDvm66ogT50dEyK06npPZQykwIzNPMCa1H0JQz4hJJ1v8AN4uxwGQ91NxP1OXyIeWVc+35JYSYFc5IYDpQFpGwSPeGX2gYaZqIyWkJSCgKOh7J9nDOHCLuS1P/2Q==',
    palette: {
    \_type: 'sanity.imagePalette',
    darkMuted: [Object],
    darkVibrant: [Object],
    dominant: [Object],
    lightMuted: [Object],
    lightVibrant: [Object],
    muted: [Object],
    vibrant: [Object]
    }
    },
    mimeType: 'image/jpeg',
    originalFilename: 'testing.jpeg',
    path: 'images/6h71nmg1/development/038d4d117f0b84d5b6449ddcb5bbcfeeee15dcf6-768x1024.jpg',
    sha1hash: '038d4d117f0b84d5b6449ddcb5bbcfeeee15dcf6',
    size: 272550,
    uploadId: 'EwQ7XbYbFeLyPSgz6c2WpsUgmt0ynsOM',
    url: 'https://cdn.sanity.io/images/6h71nmg1/development/038d4d117f0b84d5b6449ddcb5bbcfeeee15dcf6-768x1024.jpg'
    }

### API Mutation rate limit

This is designed to load 4MB or less files, one transaction per file. Each file will need to be read, processed, then sent. There doesn't appear to be a need to worry about the Maximum mutation rate limit of 25req/s. However if this becomes a problem p-queue can be used. It is pretty straight forward to implement. See links before for more information.
https://www.npmjs.com/package/p-queue
https://www.sanity.io/docs/importing-data#import-using-a-client-library
