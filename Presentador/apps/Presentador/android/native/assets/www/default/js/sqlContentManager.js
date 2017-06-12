
/* JavaScript content from js/sqlContentManager.js in folder common */

var getContentForKey = function(sectionName, success, failure){
    var sqlSentence = "SELECT url FROM content WHERE sectionKey = '" + sectionName+ "'";
    console.log("Select findFileSQL: "+ sqlSentence);

    db.transaction(function(tx) {
        tx.executeSql(sqlSentence, [], function(tx, res) {
            console.log("findSectionSQL -" + JSON.stringify(res.rows) + "-  " + "\n Transaction::: -" + tx + "- ");
            if(res.rows.lenght === 0){
                failure("inexistente");
            }else{
                console.log("URL resource:: "+ res.rows.item(0).url);
                success(res.rows.item(0).url);
            }
        }, function(error) {
            console.log('findSectionSQL:' + error.message);
        });
    }, function(error) {
        console.log('findSectionSQL: ' + error.message);
    }, function() {
        console.log('findSectionSQL findFileOnSQL ok');
    });

};

var findFileSQL = function(filename, success){
    var sqlSentence = "SELECT * FROM content WHERE filename = '" + filename+ "'";
    console.log("Select findFileSQL: "+ sqlSentence);

    db.transaction(function(tx) {
        tx.executeSql(sqlSentence, [], function(tx, res) {
            console.log("executeSql findFileOnSQL::: -" + JSON.stringify(res.rows) + "-  " + "\n Transaction::: -" + tx + "- ");
            success(res.rows);
        }, function(error) {
            console.log('executeSql findFileOnSQLr: ' + error.message);
        });
    }, function(error) {
        console.log('readTransaction Error: ' + error.message);
    }, function() {
        console.log('readTransaction findFileOnSQL ok');
    });

};

var addContentSQL = function(filename, url, version, description, key){

var sqlSentence = "INSERT INTO content (filename, url, version, description, sectionKey) " + "VALUES('"+filename+"','"+url+ "'," +version + ",'"+description+"','"+key+"')";

    console.log("this is addContentSQL query: " + sqlSentence);

    db.transaction(function(tx) {
        tx.executeSql(sqlSentence, [], function(tx, res) {
            console.log("content added: " + JSON.stringify(res));
        }, function(error) {
            console.log('addContentSQL/executeSql error: ' + error.message);
        });
    }, function(error) {
        console.log('addContentSQL errror error: ' + error.message);
    }, function() {
        console.log('addContentSQL transaction ok');
    });
};

var replaceURLForContent = function(result, filename){
    console.log("replacing: " + JSON.stringify(result) + "::" + filename);
    var updateSentence = "UPDATE content SET  url = " + "'"+filename +"'"+ "WHERE filename = "+ "'"+result.filename+"'" +" AND version = " +result.version +" AND description = "+ "'"+result.description + "'" +"AND sectionKey = " + "'" +result.sectionKey + "'";

    console.log("replaceURLForContent replacing: " + updateSentence);

    db.transaction(function(tx) {
        tx.executeSql(updateSentence, [], function(tx, res) {
            console.log("replaceURLForContent updated: " + JSON.stringify(res));
        }, function(error) {
            console.log('replaceURLForContent/executeSql error: ' + error.message);
        });
    }, function(error) {
        console.log('replaceURLForContent errror error: ' + error.message);
    }, function() {
        console.log('replaceURLForContent transaction ok');
    });
};

var replaceContentSQL = function(result, filename, url, version, description, key){
    var insertSentence = "INSERT INTO content (filename, url, version, description, sectionKey) " + "VALUES('"+filename+"','"+url+ "'," +version + ",'"+description+"','"+key+"')";
    var deleteSentence =  "DELETE FROM content WHERE filename = "+ "'"+result.filename+"'" +"AND url= "+"'"+ result.url+ "'" +" AND version = "+ result.version + " AND description = "+ "'"+result.description + "'" +" AND sectionKey = " + "'" +result.sectionKey + "'";


    db.transaction(function(tx) {
        tx.executeSql(deleteSentence, [], function(tx, res) {
            console.log("replaceContentSQL deleteSentence: " + JSON.stringify(res));
        }, function(error) {
            console.log('replaceContentSQL deleteSentence: error: ' + error.message);
        });
    }, function(error) {
        console.log('replaceContentSQL deleteSentence:  error: ' + error.message);
    }, function() {
        console.log('replaceContentSQL deleteSentence: transaction ok');
    });

    db.transaction(function(tx) {
        tx.executeSql(insertSentence, [], function(tx, res) {
            console.log("replaceContentSQL insertSentence: " + JSON.stringify(res));
        }, function(error) {
            console.log('replaceContentSQL insertSentence: error: ' + error.message);
        });
    }, function(error) {
        console.log('replaceContentSQL insertSentence:  error: ' + error.message);
    }, function() {
        console.log('replaceContentSQL insertSentence: transaction ok');
    });
};

var getFilesSQL = function(success, failure){
    $.getJSON(baseURL, {} )
    .done(function( json ) {
        var contents = json.content;
        var urlArray = "";

        $.each(contents, function(i, content) {
            urlArray += content.url /*+ "$"+ content.filename*/ +"#V" + content.version + ",";

            findFileSQL(content.filename, function(results){
                if(results.length === 0){
                    $.each(content.section, function(j, section){
                        addContentSQL(content.filename, "", content.version, content.description, section.key);
                    });
                }else{
                    for (var i=0; i < results.length; i++) {
                        console.log("sectionKey::" + results.item(i).sectionKey);
                        if(results.item(i).version !== content.version){
                            console.log("si esta reemplazando");
                            replaceContentSQL(results.item(i), content.filename, "", content.version, content.description, content.key);
                        }

                    }
                }
            });
        });

        var finalURLString = urlArray.substring(0, urlArray.length-1);
        success(finalURLString);
    })
    .fail(function( jqxhr, textStatus, error ) {
        failure(textStatus, error);
    });

};
