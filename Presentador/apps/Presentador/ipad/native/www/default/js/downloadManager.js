
/* JavaScript content from js/downloadManager.js in folder common */
var documentsCollection;
var collectionName = "documents";
var ctx = {};

//function wlCommonInit(){
//	WL.Client.connect({
//		onSuccess : function() { console.log("Connected to MFP Server!");},
//		onFailure : function() { console.log("Failed to connect to MFP Server!");}
//		});
//
//	var collections = {};
//	collections[collectionName] = {
//			searchFields : { name:"string", timestamp:"integer"},
//	};
//
//	//Initialize the document collection
//	WL.JSONStore.init(collections)
//	.then(function() {
//		documentsCollection = WL.JSONStore.get(collectionName);
//		documentsCollection.findAll({}).then(function (allDocs) { // If any document already available, display in the list
//			printList(allDocs);
//		});
//
//	})
//	.fail(function(errorObject) {
//		console.log("Failed to initialize collection");
//	});
//
//	try { // Get access to app file system for storage of individual documents
//		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
//	} catch(error) {
//		console.log("Cannot get access to file system in web app");
//	}
//}

function gotFS(fileSystem) {
	console.log("got fs: fileSystem.name:"+fileSystem.name);
	console.log("fileSystem.root.name:"+fileSystem.root.name);
	ctx.fileSystem = fileSystem;
}

function fail(evt) {
	console.log("Received failed event", evt);
	console.dir(evt);
}

var nbDocsFound;
var docsToUpdate;
var docsToAdd;
function getDocumentList() {
	var request = new WLResourceRequest("/adapters/DocumentReader/docs/getDocList", WLResourceRequest.GET);
	request.send()
	.then(function (responseFromAdapter) {
		// Handle adapter success
		var data = JSON.parse(responseFromAdapter.responseText).documents;
		// First check if some documents have their timestamp updated
		nbDocsFound = data.length;
		docsToUpdate = [];
		docsToAdd = [];

		data.forEach( function(doc) {
			console.log("current doc "+doc.name);
			doc.pdfLoaded = false;
			documentsCollection.find({'name': doc.name}, {limit:1}).then(function (existingDocs) {
				// This code is executed asynchronously (after the loop exits)
				if(existingDocs.length==1) { // document already exists locally
					if(existingDocs[0].json.timestamp!=doc.timestamp) { // document needs to be updated
						console.log(doc.name + " is updated!");
						docsToUpdate.push({_id: existingDocs[0]._id, json: doc});
					}
				} else if(existingDocs.length===0) { // document doesn't exist locally
					console.log("adding document "+doc.name);
					docsToAdd.push(doc);
				}
				displayUpdatedDocumentList();
			});
		});

	})
	.fail(function (errorObject) {
		// Handle invokeProcedure failure.
	});
}

function displayUpdatedDocumentList() {
	if(--nbDocsFound) return; // Wait until all promises have been executed
	console.log("after promises "+docsToAdd.length+":"+docsToUpdate.length);
	updateDocs()
	.then(function(numberOfDocumentsReplaced) {
		console.log("Successfully updated "+numberOfDocumentsReplaced+" documents");
		addDocs()
		.then(function (numberOfDocumentsAdded) {
			console.log("Successfully added "+numberOfDocumentsAdded+" documents");
			documentsCollection.findAll({})
			.then(function (allDocs) {
				console.log("printing list");
				printList(allDocs);
			});
		});
	});
}

function updateDocs() {
	if(docsToAdd.length>0) { // Add new items into collection
		return documentsCollection.add(docsToAdd, {markDirty: false});
	}
	var dfd = new $.Deferred();
	dfd.resolve(0);
	return dfd.promise();
}

function addDocs() {
	if(docsToUpdate.length>0) { // Update collection
		return documentsCollection.replace(docsToUpdate, {markDirty: false});
	}
	var dfd = new $.Deferred();
	dfd.resolve(0);
	return dfd.promise();
}

function printList(allDocs) {
	var ul = $('#docList'), doc, li;
	ul.empty();
	for (var i = 0; i < allDocs.length; i += 1) {
		doc = allDocs[i].json;
		// Create new <li> element
		li = $('<li doc_loaded="'+doc.pdfLoaded+'" doc_name="'+doc.name+'"/>');
		var text = $('<span/>').text(doc.title);
		li.append(text);
		var loadedText = doc.pdfLoaded ? "kb" : " (not downloaded)";
		li.append('<div> ts: ' + doc.timestamp + ", size: "+ doc.size + loadedText + '</div>');
		ul.append(li);
	}
	//ul.listview('refresh');
}

$('#docList').on('click', 'li', function() {
	var docLoaded = $(this).attr("doc_loaded")==="true";
	console.log("docList - click >> "+$(this).attr("doc_loaded"));
	if(docLoaded) {
		var docName = $(this).attr("doc_name");
		console.log("before trying to launch "+docName);
		var localPath = getFilePath(docName);
		window.open(localPath, getTarget(), "location=yes,hidden=no,closebuttoncaption=Close");
	}
});

function downloadDocuments() {
	documentsCollection.findAll({})
	.then(function (allDocs) {
		allDocs.forEach( function(jdoc) {
			doc = jdoc.json;
			if(!doc.pdfLoaded) {
				downloadDocument(doc.name);
				doc.pdfLoaded = true;
			}
		});
		// update the collection
		documentsCollection.replace(allDocs, {markDirty : false});
		// redraw list
		printList(allDocs);
	})
	.fail(function (errorObject) {
	  // Handle failure.
	});
}

function getFilePath(fileName) {
	console.log("Needs to be implemented in each platform");
	return false;
}

function getTarget() {
	console.log("Needs to be implemented in each platform");
	return false;
}

/**
 * Version where the download of individual documents is made by invoking a remote web server.
 * Comment this function if you want to use the other implementation
 * Replace the pdfRemoteUrl variable with the base URL of the remote web server
 */
//var pdfRemoteUrl = "http://192.168.1.35:10080/MockService/"; //TODO: replace with URL of the web server where documents are located
var pdfRemoteUrl = "http://cristopherbg.xyz/";
function _downloadDocument(docName) {
	//console.log("downloadDocument:pdfRemoteUrl"+pdfRemoteUrl+":docName:"+docName);
	var localPath = getFilePath(docName);
	var fileTransfer = new FileTransfer();
	fileTransfer.download(
			pdfRemoteUrl + docName, // remote file location
			localPath, // where to store file locally
			function (entry) {
				console.log("download complete: " + entry.fullPath);
			},
			function (error) {
				//Download abort errors or download failed errors
				console.log("download error source " + error.source);
			}
	);
}

/**
 * Version where the download of individual documents is made by invoking MFP adapters.
 * If you want to test this implementation, rename this function to "downloadDocument" and rename or comment the implementation above.
 */
function downloadDocument(docName) {
	//var request = new WLResourceRequest("/adapters/DocumentReader/docs/getDocContent/"+docName, WLResourceRequest.GET);
	var request = new WLResourceRequest("http://cristopherbg.xyz/"+docName, WLResourceRequest.GET);
	request.send()
	.then(function (response) {
		// Handle invokeProcedure success: remove backslash character and decode binary data
		//var content = Base64Binary.decodeArrayBuffer(response.responseText.replace(/\\/g,"" ));
		var content = response;
		var localPath = getFilePath(docName);
		function writeDocument(fileEntry) {
			console.log("into file entry ",fileEntry.fullPath);
		    fileEntry.createWriter(
		    		function (writer) {
		    			console.log("before writing");
		    		    writer.onwriteend = function(evt) {
		    		        console.log("done written pdf "+docName);
		    		    };
		    		    writer.write(content);
		    		},
		    		fail);
		}
		// Write file on local system
		window.resolveLocalFileSystemURL(
				localPath.substring(0, localPath.lastIndexOf('/')), // retrieve directory
				function(dirEntry) {
					console.log("I am in directory "+dirEntry.fullPath);
					dirEntry.getFile( // open new file in write mode
							docName,
							{create: true, exclusive: false},
							writeDocument,
							fail);
				},
				fail);
	})
	.fail(function (errorObject) {
		// Handle invokeProcedure failure.
		console.log("Failed to load pdf from adapter", errorObject);
	});
}

//download Content JSON from Documents Adapter

// var nbDocsFound;
// var docsToUpdate;
// var docsToAdd;
function getContentsAdapter() {
	var request = new WLResourceRequest("/adapters/DocumentReader/docs/getContent", WLResourceRequest.GET);
	request.send()
	.then(function (responseFromAdapter) {
		var data = JSON.parse(responseFromAdapter.responseText);

		var privateSection = data.privado;
		var publicSection = data.publico;
		console.log("Current JSON: "+data);
		console.log("Current private: "+ privateSection);
		console.log("Current public: "+ publicoSection);

		processProducts(privateSection);
		processProducts(publicSection);
	})
	.fail(function (errorObject) {
		// Handle invokeProcedure failure.
	});
}

function processContent(contents) {


}

function processProducts(products) {

}
