# Qlik Sense Master Item Repository

QS MIR is a web application written in JavaScript that should help Qlik Sense users manage their master items across their Qlik platform. The basic functionality allows users to:

* Connect to an app
* List, preview and extract master dimensions and measures 
* Manage (store, clone, edit or delete) these master items
* Export modified or original master items back to ANY app

![Quick Demo](./resources/qsmir.gif)

## Technology

The entire solution has been created in JavaScript/Node.js using React.js for the front end, enigma.js for the Qlik platform communication, express for the API and sqlite for storage. 

## Compatibility

This has been tested with Qlik Sense Server and Desktop February and April 2019 - Since enigma has been available longer it might work with legacy versions. 

## Installation

To install QS MIR do the following:

0) Have node js installed :-)

1) Clone or Download this repository and unzip to a folder on your PC / Server

2) Open a command prompt and navigate to the project's folder you created in 1). Here, run ```npm install```

3) If you're running this with Qlik Sense Desktop, skip to step _X_. For Server continue with step _4_

4) To enable the backend to communicate with Qlik we need to export certificates through yor QMC (or via API) see [HERE](https://help.qlik.com/en-US/sense/April2019/Subsystems/ManagementConsole/Content/Sense_QMC/export-certificates.htm) to find out how. 

5) Copy the certificates to the following path in your project folder ```<Your project folder>/src/server/cert```

