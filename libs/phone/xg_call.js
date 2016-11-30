/*
 * xg_call.js 封装打电话方法
 * version 1.0
 * Copyright (c) 2012 Developped By camelliae
 */ 
 
 function callOutPhone_xg(phone)
 {
 	var fso = new ActiveXObject( "Scripting.FileSystemObject");  
 	// var a = fso.CreateTextFile( "c:\\xzjxj.txt", true);  
 	var a = fso.CreateTextFile( "c:\\testfile.txt", true); 
	a.WriteLine(phone);
	a.Close();  
 }
 
 function readFile(filename)
{  
	var fso = new ActiveXObject("Scripting.FileSystemObject");  
	
	var s = "";  
	if(fso.FileExists(filename))
	{ 
		var f = fso.OpenTextFile(filename,1);  
		while (!f.AtEndOfStream)  
		s += f.ReadLine();
		f.Close();  
	}
	return s;  
}

function deleteFile(filename)
{
	var fso = new ActiveXObject("Scripting.FileSystemObject");  
	if(fso.FileExists(filename))
	fso.DeleteFile(filename);  

}
function getHistoryId()
{
	var id = readFile("c:\\chidfile.txt");
	deleteFile("c:\\chidfile.txt")
	return id;
}

function transOut_xg(phoneNumber)
{
	var fso = new ActiveXObject( "Scripting.FileSystemObject");  
 	var a = fso.CreateTextFile( "c:\\transoutphone.txt", true);  
	a.WriteLine(phoneNumber);
	a.Close(); 
}

function transToAgent_xg(agentId)
{
	var fso = new ActiveXObject( "Scripting.FileSystemObject");  
 	var a = fso.CreateTextFile( "c:\\transtoagent.txt", true);  
	a.WriteLine(agentId);
	a.Close(); 
}

function transToQueue_xg(queueId)
{
	var fso = new ActiveXObject( "Scripting.FileSystemObject");  
 	var a = fso.CreateTextFile( "c:\\transToQueue.txt", true);  
	a.WriteLine(queueId);
	a.Close(); 
}

function transToIVR_xg(ivrNode)
{
	var fso = new ActiveXObject( "Scripting.FileSystemObject");  
 	var a = fso.CreateTextFile( "c:\\transToIVR.txt", true);  
	a.WriteLine(ivrNode);
	a.Close(); 
}
