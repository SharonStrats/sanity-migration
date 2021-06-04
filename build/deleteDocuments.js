"use strict";
'use-strict';
require('dotenv').config();
var sanityClient = require('@sanity/client');
var sanityClientConfig = {
    projectId: process.env.SANITY_PROJECT || '6h71nmg1',
    dataset: process.env.SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    apiVersion: '2021-03-25',
    useCdn: false
};
var client = new sanityClient(sanityClientConfig);
var deleteDocuments = function (documentType) {
    var queryString = "*[_type == '" + documentType + "'][0...999]";
    console.log(queryString);
    client
        .delete({ query: queryString })
        .then(console.log)
        .catch(console.error);
};
deleteDocuments('whatevertype you want to delete');
