
/* JavaScript content from js/pxXMLGenerator.js in folder common */

var createXML = function(){
    var xml = new XMLWriter('UTF-8');
    xml.formatting = 'indented';
    xml.indentChar = ' ';
    xml.indentation = 4;

    return xml;
};

var insertNodeWithAtrribute = function(xmlWriter, nodeName, nodeAttributeNameArray, nodeAttributeValue){
    xmlWriter.writeStartElement(nodeName);
    for(i = 0; i < nodeAttributeNameArray.length; i++){
        xmlWriter.writeAttributeString(nodeAttributeNameArray[i], nodeAttributeValue[i]);
    }
    xmlWriter.writeEndElement();
};



var insertNode = function(xmlWriter, nodeName, nodeData){
    if(!nodeData){
        xmlWriter.writeStartElement(nodeName);
        xmlWriter.writeEndElement();
    }
    else{
        xmlWriter.writeElementString(nodeName ,nodeData);
    }
};

var insertPersonData = function(xmlWriter, id, age, gender, habit){
    xmlWriter.writeComment('Main Person ' + id );
    xmlWriter.writeStartElement('Person');
    xmlWriter.writeAttributeString( 'id', id);
        xmlWriter.writeStartElement('Features');
            insertNode(xmlWriter, 'Gender', gender);
            insertNode(xmlWriter, 'Habit', habit);
        xmlWriter.writeEndElement();
    xmlWriter.writeEndElement();
};

var insertComplementaryPersonData = function(xmlWriter, id, age, genderBool, habitBool){
    xmlWriter.writeComment('Complementary Person ' + id );
    xmlWriter.writeStartElement('Person');
    xmlWriter.writeAttributeString( 'id', id);
        xmlWriter.writeStartElement('Features');
            insertNode(xmlWriter, 'Age', age.toString());
            var gender = genderBool === true ? 'true' : 'false';
            insertNodeWithAtrribute(xmlWriter, 'Gender', ['xsi:nil'], [gender]);
            var habit = habitBool === true ? 'true' : 'false';
            insertNodeWithAtrribute(xmlWriter, 'Habit', ['xsi:nil'], [gender]);
        xmlWriter.writeEndElement();
    xmlWriter.writeEndElement();
};

var insertCoverageData = function(xmlWriter, coverageID, coverageType, insuredAmount, coveragePersonID, referenceID){
    xmlWriter.writeComment('Coverage ' + coverageID );
    xmlWriter.writeStartElement('Coverage');
    xmlWriter.writeAttributeString( 'id', coverageID);
        xmlWriter.writeStartElement('Features');
            insertNode(xmlWriter, 'Coverage_type', coverageType);
        xmlWriter.writeEndElement();
        xmlWriter.writeStartElement('Links');
            xmlWriter.writeStartElement('Coverage-Person');
                xmlWriter.writeStartElement('Coverage-Person');
                xmlWriter.writeAttributeString( 'id', coveragePersonID);
                    xmlWriter.writeStartElement('Features');
                        if(insuredAmount){
                            insertNode(xmlWriter, 'Insured_amount', insuredAmount.toString());
                        }else{
                            insertNodeWithAtrribute(xmlWriter, 'Insured_amount', ['xsi:nil'], ['true']);
                        }
                    xmlWriter.writeEndElement();
                    xmlWriter.writeStartElement('Links');
                        xmlWriter.writeStartElement('Person');
                                insertNodeWithAtrribute(xmlWriter, 'clc:Reference', ['ref'], [referenceID]);
                        xmlWriter.writeEndElement();
                    xmlWriter.writeEndElement();
                xmlWriter.writeEndElement();
            xmlWriter.writeEndElement();
        xmlWriter.writeEndElement();
    xmlWriter.writeEndElement();
};

var insertPolicyData = function(xmlWriter, id, coverages, insuredAmount){
    xmlWriter.writeComment('Policy ' + id );
    xmlWriter.writeStartElement('Policy');
    xmlWriter.writeAttributeString('id', id);
        xmlWriter.writeStartElement('Links');
            xmlWriter.writeStartElement('Coverage');
                insertCoverage(xmlWriter, 'ID4','BAS', insuredAmount, 'ID99', 'ID30');
                for(var i = 0; i<coverages.length; i++){
                    insertCoverage(xmlWriter, 'ID4','BAS', null, 'ID99', 'ID30');
                }
            xmlWriter.writeEndElement();
        xmlWriter.writeEndElement();
    xmlWriter.writeEndElement();
};

var insertCalculationData = function(xmlWriter, policyData, peopleData){
    insertNodeWithAtrribute(xmlWriter, 'clc:DeplR', ['dep-name','ver-sel'], ['Deployment Met99', 'last']);
    xmlWriter.writeComment('Calculation Data ');
        xmlWriter.writeStartElement('clc:CalculationData');
            insertPolicyData(xmlWriter, 'ID_P1', [], 200000);
            insertPersonData(xmlWriter, 'ID_PER0', peopleData[0].age, peopleData[0].gender, peopleData[0].habit);
            for(var i = 1; i < peopleData.length; i++){
                insertPersonData(xmlWriter, peopleData[i].id, peopleData[i].age, peopleData[i].gender, peopleData[i].gender);
            }
        xmlWriter.writeEndElement();
    xmlWriter.writeEndElement();
};

var generatePXxml = function(){

    var xml = createXML();

    xml.writeStartDocument( );
    xml.writeDocType('"items.dtd"');
    xml.writeStartElement( 'items' );
    insertPolicyData(xml, 'idp', null, 2000000);
    insertPersonData(xml, 'ID29', 29, 'Male', 'Smoker');
    insertComplementaryPersonData(xml, 'ID29', 29, true, false);
    xml.writeEndElement();
    xml.writeEndDocument();

    console.log("XML: " + xml.flush());
};
