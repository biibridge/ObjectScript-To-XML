# objectscript-to-xml README

Exports InterSystems object scripts in XML

Use this extension to export InterSystems object script classes in XML.

## Features
Downloads the classes as XML files to the specified location.
When multiple classes are selected, you can export one XML file per class, or all of them in one XML file.

## Parameters
* exportDir: Specifies the destination to save the exported file.
* Bundled: If this parameter is set to True, multiple selected classes will be bundled into a single XML file and exported.

## Introduction
1. From the given repository, download the xml file and import it into any namespace.
2. Create a web application and specify "exml.webservice.Broker" as the dispatch class.
3. In the extension parameters, set the application name you created to applicationName. By default, it is "/exml-api".
