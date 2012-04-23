var couchhost = "http://127.0.0.1:5984";
var dbname = "anywhere";
var json2path = "/_utils/script/json2.js";
var path = "data.json";

importForcely(couchhost + json2path);

function couchData(){
	this.id = arguments[0],
	this.value = arguments[1],
	
    this.getValueFromFile = function (filepath) {
		try {
			var jsondata = WScript.CreateObject("Scripting.FileSystemObject").OpenTextFile(filepath, 1).ReadAll();
			this.value = JSON.parse(jsondata);
			return this.value;
		} catch (e) {
			WScript.Echo(e);
		}
	},
	
	this.getValueFromURL = function (filepath) {
		try {
			var xmlHttpHandler = WScript.CreateObject("Msxml2.XMLHTTP");
			xmlHttpHandler.open("GET", filepath, false);
			xmlHttpHandler.send();
			return JSON.parse(xmlHttpHandler.responseText);
		} catch (e) {
			WScript.Echo(e);
		}
	}
};

function couchDBA(host, dbn){
	this.host = host;
	this.dbn = dbn;
}
couchDBA.prototype = ({
	host: "http://127.0.0.1:5984",
	dbn: "anywhere",
	sendQuery: function (datatmp, method, query) {
		try {
			var xmlHttpHandler = WScript.CreateObject("Msxml2.XMLHTTP");
			xmlHttpHandler.open(method, query, false);
			xmlHttpHandler.send(JSON.stringify(datatmp.value));
			//WScript.Echo(JSON.stringify(datatmp.value));
		} catch (e) {
			WScript.Echo(JSON.stringify(e));
		}
		return JSON.parse(xmlHttpHandler.responseText);
	},
	executeGenerally: function (datatmp, method){
		return this.sendQuery (datatmp, method, this.host + "/" + this.dbn + "/" + datatmp.id);
	},

	putData: function (datatmp) {
		return this.executeGenerally(datatmp, "PUT");
	},
	getData: function (datatmp) {
		return this.executeGenerally(datatmp, "GET");
	},
	updateData: function (datatmp) {
		datatmp.value._rev = this.getData(datatmp)._rev;
		return this.putData(datatmp);
	},
	deleteData: function (datatmp) {
		return this.sendQuery(datatmp, "DELETE", this.host + "/" + this.dbn + "/" + datatmp.id + "?" + "rev=" + this.getData(datatmp)._rev);
	},
	createDB: function (){ 
		return this.sendQuery("", "PUT", this.host + "/" + this.dbn );
	}
});

function importForcely(url) {
	try {
		var xmlHttpHandler = WScript.CreateObject("Msxml2.XMLHTTP");
		xmlHttpHandler.open("GET", url, false);
		xmlHttpHandler.send();
		eval(xmlHttpHandler.responseText);
	} catch (e) {
		WScript.Echo(e);
	}
};


var data = new couchData();
data.getValueFromFile(path);

var cdh = new couchDBA(couchhost, dbname);

WScript.Echo(JSON.stringify(cdh.createDB(data)));
WScript.Echo(JSON.stringify(cdh.putData(data)));
//WScript.Echo(JSON.stringify(cdh.updateData(data)));
WScript.Echo(JSON.stringify(cdh.getData(data)));
WScript.Echo(JSON.stringify(cdh.deleteData(data)));
