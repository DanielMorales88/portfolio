
/* JavaScript content from js/met99Calculator.js in folder common */
var db;

var coverageArray = [{
    rate: 200000,
    gender: 'H',
    smoker: 1,
    coverage: 'BAS',
    age: 35,
},
{
    rate: 200000,
    gender: 'H',
    smoker: 1,
    coverage: 'GFH3',
    age: 18,
},
{
    rate: 200000,
    gender: 'H',
    smoker: 1,
    coverage: 'CII',
    age: 35,
},
{
    rate: 200000,
    gender: 'H',
    smoker: 1,
    coverage: 'TIBA',
    age: 35,
},
{
    rate: 200000,
    gender: 'H',
    smoker: 1,
    coverage: 'CAT',
    age: 35,
},
{
    rate: 200000,
    gender: 'H',
    smoker: 1,
    coverage: 'GFT',
    age: 35,
},
{
    rate: 200000,
    gender: 'H',
    smoker: 1,
    coverage: 'BAS',
    age: 32,
},
{
    rate: 200000,
    gender: 'H',
    smoker: 1,
    coverage: 'GFT',
    age: 60,
}];

function loadMet99Database(){
    db = window.sqlitePlugin.openDatabase({name: "quotation.db", createFromLocation: 1});
}
function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function getBiweeklyFee(coverages, completionFunction){

    var fees =[];
    var finalFee = 0;

    db.transaction(function(tx) {

        for (var i=0; i < coverages.length; i++){
        		//console.log("getBiweeklyFee Object for Query: "+JSON.stringify(coverages[i]));
                var sqlSentence = "SELECT fee FROM price WHERE rate = " + coverages[i].rate +
                " and gender = \'" + coverages[i].gender +
                "\' and smoker = " +  coverages[i].smoker +
                " and coverage = \'" + coverages[i].coverage +
                "\' and age = " + coverages[i].age;
                
                //console.log("sqlSentence "+sqlSentence);

                tx.executeSql(sqlSentence, [], function(tx, res) {
                    console.log("Response::: -" + res + "-  " + "\n Transaction::: -" + tx + "- ");

                    for (var i=0; i < res.rows.length; i++) {
                        console.log("Fee::" + res.rows.item(i).fee);
                        fees.push(res.rows.item(i).fee);
                    }
                }, function(error) {
                    console.log('SELECT error: ' + error.message);
                });        		
        	
        }

    }, function(error) {
        console.log('transaction error: ' + error.message);
    }, function() {
        console.log('transaction ok');


        for (var i=0; i < fees.length; i++) {
            finalFee += fees[i];
        }
        console.log("this is the final fee: " + finalFee);
        completionFunction(finalFee);
    });
}

function getSomething(){
    db.transaction(function(tx) {
        tx.executeSql("Select fee from price where rate = 150000 and gender = 'H' and smoker = 1 and coverage = 'BAS' and age = 16", [], function(tx, res) {
            console.log("Response:::: " + res + "  "+ res.rows + "transaction:: " + tx);

            for (var i=0; i < res.rows.length; i++) {
                console.log("Fee::" + res.rows.item(i).fee);
            }

        }, function(error) {
            console.log('SELECT error: ' + error.message);
        });
    }, function(error) {
        console.log('transaction error: ' + error.message);
    }, function() {
        console.log('transaction ok');
    });
}
