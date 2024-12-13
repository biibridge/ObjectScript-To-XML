# objectscript-to-xml README

Exports InterSystems object scripts in XML

Use this extension to export InterSystems object script classes in XML.

## Features
Open the context menu from the edit screen or from the Explorer and click "ObjectScript Export XML" to export the class in XML format.
Downloads the classes as XML files to the specified location.
When multiple classes are selected, you can export one XML file per class, or all of them in one XML file.

## Parameters
* exportDir: Specifies the destination to save the exported file.
* bundled: If this parameter is set to True, multiple selected classes will be bundled into a single XML file and exported.

## Introduction
1. Download the xml file from the specified repository below and import it into the namespace of your choice.
  [import XML file](https://github.com/biibridge/ObjectScript-To-XML/blob/main/importSource/objectscript-to-xml.xml)
2. Create a web application and specify "exml.webservice.Broker" as the dispatch class.
3. In the extension parameters, set the application name you created to applicationName. By default, it is "/exml-api".

## Notes
* This extension requires the "InterSystems ObjectScript" extension and "InterSystems Server Manager" extension.
* The "InterSystems ObjectScript" extension requires the following settings: "objectscript.conn.server", "objectscript.conn.ns".
* A class with the same name as the selected file will be exported from the server, so it will not reflect any content that has not been imported to the server.