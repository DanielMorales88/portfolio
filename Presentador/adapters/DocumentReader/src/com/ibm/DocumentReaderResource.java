/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

package com.ibm;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.Properties;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.commons.codec.binary.Base64;

import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONObject;

@Path("/docs")
public class DocumentReaderResource {
	static final String rootDirectory = "/Users/Shared/mydocs"; // Root path where documents are stored

	FilenameFilter fileNameFilter = new FilenameFilter() {
		@Override
		public boolean accept(File dir, String name) {
			return name.toLowerCase().endsWith(".pdf") || name.toLowerCase().endsWith(".mp4");
		}
	};

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/getContent")
	public JSONObject getContentJSON() {
		JSONObject contentJSON = new JSONObject();
		try{
		
			File privateDirectory = new File(rootDirectory+"/privado");
			File publicDirectory = new File(rootDirectory+"/publico");
			
			JSONArray privateArray = populateJSON(privateDirectory.listFiles());
			JSONArray publicArray = populateJSON(publicDirectory.listFiles());
			System.out.println("this is the private array" + privateArray);
			System.out.println("this is the public array" +publicArray);
			contentJSON.put("privado", privateArray);
			contentJSON.put("publico", publicArray);
		}
		catch (Exception e){
			contentJSON = getErrorJSON(-1, "Incorrect file system structure");
		}
		
		return contentJSON;
	}
	
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/getDocList")
	public JSONObject getDocumentList() {
		JSONObject docList = new JSONObject();
		JSONArray docs = new JSONArray();
		File directory = new File(rootDirectory);
		for(File f : directory.listFiles(fileNameFilter)) {
			JSONObject doc = new JSONObject();
			doc.put("name", f.getName());
			doc.put("title", f.getName().substring(0, f.getName().length()-4));
			doc.put("size", f.length()/1024); // get file size in kb
			doc.put("timestamp", f.lastModified());
			docs.add(doc);
		}
		/*for(int i=1;i<5;i++) {
			JSONObject doc = new JSONObject();
			doc.put("name", "doc"+i+".pdf");
			doc.put("title", "doc"+i);
			doc.put("size", "1mb"); // get file size in kb
			doc.put("timestamp", "1446157261");
			docs.add(doc);
		}*/
		docList.put("documents", docs);
		docList.put("statusCode", 200);
		return docList;
	}
	
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	@Path("/getDocContent/{documentId}")
	public String getDocumentContent(@PathParam("documentId") String documentId) throws IOException {
		//return getEncodedContent(rootDirectory+ "/" + documentId);
		return getEncodedContentOnline("http://cristopherbg.xyz/" + documentId);
	}

	@SuppressWarnings("unused")
	private static String getEncodedContent(String url) throws IOException {
        byte[] buf = new byte[8192];
        InputStream is = new FileInputStream(url);
        ByteArrayOutputStream bos = new  ByteArrayOutputStream();

        int read = 0;
        while ((read = is.read(buf, 0, buf.length)) > 0) {
        	bos.write(buf, 0, read);
        }
        bos.close();
        is.close();

	    return Base64.encodeBase64String(bos.toByteArray());
	}
	//@SuppressWarnings("unused")
	private static String getEncodedContentOnline(String urlString) throws IOException {
		URL url = new URL(urlString);
        byte[] buf = new byte[8192];
        URLConnection connection = url.openConnection();
        // Since you get a URLConnection, use it to get the InputStream
        InputStream is = connection.getInputStream();
        // Now that the InputStream is open, get the content length
        int contentLength = connection.getContentLength();
        ByteArrayOutputStream bos = new  ByteArrayOutputStream();

        int read = 0;
        while ((read = is.read(buf, 0, buf.length)) > 0) {
        	bos.write(buf, 0, read);
        }
        bos.close();
        is.close();

	    return Base64.encodeBase64String(bos.toByteArray());
	}
	
	private String getFileDescription(final String filename, String configFilePath){
	
		Properties prop = new Properties();
		InputStream input = null;
		String underScoredName = filename.replace(".","_");
		String fileDescription = underScoredName;
		
		try {
			input = new FileInputStream(configFilePath);
			//load a properties file
			prop.load(input);
			fileDescription = prop.getProperty(underScoredName);
			System.out.println(fileDescription);
		} catch (IOException ex) {
			ex.printStackTrace();
		} finally {
			if (input != null) {
				try {
					input.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		
		return fileDescription;
	}
	
	//Just to know files hierarchy
	public static void showFilesHierarchy(File[] files) {
		
	    for (File file : files) {
	        if (file.isDirectory()) {
	            System.out.println("Directory: " + file.getName());
	            showFilesHierarchy(file.listFiles()); // Calls same method again.
	        } else {
	            System.out.println("File: " + file.getName());
	        }
	    }
	}
	
	//Just to know files hierarchy
	public JSONArray populateJSON(File[] files) {
		JSONArray jsonArray = new JSONArray();
		
		for (File file : files) {
			if (file.isDirectory()) {
				JSONObject product = new JSONObject();
				product.put("_id", "0");
				product.put("name", file.getName());
				product.put("description", file.getName());
				
				JSONArray contents = new JSONArray();
				
				for(File f : file.listFiles(fileNameFilter)) {
					JSONObject content = new JSONObject();
					String name = f.getName();
					String absolutePath = f.getAbsolutePath();
					
					content.put("lastUpdated",f.lastModified());
					content.put("type", name.contains(".pdf") ? "pdf" : "video");
					content.put("url", absolutePath.replace(rootDirectory, ""));
					//content.put("url", f.getPath().replace(rootDirectory, "")); --don't know which is the right one
//					content.put("description", getFileDescription(name, f.getAbsolutePath().replace(name, "config.properties")));
					String configFilePath = absolutePath.replace(name, "config.properties");
					content.put("description", getFileDescription(name, configFilePath));//configFilePath);
					contents.add(content);
				}
				
				product.put("content", contents);
				JSONArray moreProducts = populateJSON(file.listFiles()); // Calls same method again.
				product.put("products", moreProducts);
				jsonArray.add(product);
			}
			else {
		    	System.out.println("File: " + file.getName());
		    }
		}
		
		return jsonArray;
	}
	
	
	private JSONObject getErrorJSON(int errorCode, String errorString){
		JSONObject errorJSON = new JSONObject();
		JSONObject errorStatus = new JSONObject();
		
		errorStatus.put("message", errorString);
		errorStatus.put("_id", errorCode);
		errorJSON.put("error", errorStatus);
		
		return errorJSON;
	}
	
	
}
