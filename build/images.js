"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var config_1 = require("./config");
var client_1 = __importDefault(require("@sanity/client"));
var fs_1 = require("fs");
var path_1 = require("path");
var data;
var rawData;
var path;
var sanityClientConfig = {
    projectId: process.env.SANITY_PROJECT || '6h71nmg1',
    dataset: process.env.SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    apiVersion: '2021-03-25',
    useCdn: false
};
var client = client_1.default(sanityClientConfig);
var loadData = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            fs_1.readdirSync(config_1.IMAGE_MAPPING_DIR).forEach(function (file) { return __awaiter(void 0, void 0, void 0, function () {
                var dataArray;
                return __generator(this, function (_a) {
                    path = config_1.IMAGE_MAPPING_DIR + file;
                    rawData = fs_1.readFileSync(path, 'utf8');
                    dataArray = rawData.split('\n');
                    dataArray.forEach(function (row) { return __awaiter(void 0, void 0, void 0, function () {
                        var recordArray, documentID, imageFileName, fieldName, filePath, readStream, stream;
                        return __generator(this, function (_a) {
                            recordArray = row.split(',');
                            documentID = recordArray[0];
                            imageFileName = recordArray[1];
                            fieldName = recordArray[2];
                            filePath = config_1.IMAGE_DIR + imageFileName;
                            readStream = fs_1.createReadStream(filePath);
                            stream = readStream;
                            // @ts-ignore
                            client.assets
                                .upload('image', stream, {
                                filename: path_1.basename(filePath)
                            })
                                .then(function (imageAsset) {
                                var _a;
                                // Here you can decide what to do with the returned asset document. 
                                // If you want to set a specific asset field you can to the following:
                                return client
                                    .patch(documentID)
                                    .set((_a = {},
                                    _a[fieldName] = {
                                        _type: 'image',
                                        asset: {
                                            _type: "reference",
                                            _ref: imageAsset._id
                                        }
                                    },
                                    _a))
                                    .commit(); // this commit may need to only get added to last one
                            })
                                .then(function () {
                                console.log("Done!");
                            });
                            return [2 /*return*/];
                        });
                    }); });
                    return [2 /*return*/];
                });
            }); });
        }
        catch (e) {
            console.log(e);
        }
        finally {
        }
        return [2 /*return*/];
    });
}); };
loadData();
