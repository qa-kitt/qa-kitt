
# TestComplete
This project is to hold the TestComplete scripts for automated testing. 

# Getting Started
This guide will help you get up and running with TestComplete.

 1. **Installation process**
    ```
	TestComplete > https://my.smartbear.com/ (see Cameron for credentials)
	```
 2. **Environment dependencies**
    ```
		1. QA All The Way
			a. This automation is designed to run against the QA environments and frameworks.
		2. Test Agent VM 
			a. Running/Executing automated tests will be done through the W10-Selenium VM.

	```
 3. **Software dependencies**
    ```
		1. SQL Server Management Studio
			a. Create users to be run and their steps to be tested.
		2. Git
			a. Create scenarios for the user(s) to test.
			b. Azure Repo is qa-automation - pull from development or main branch.
		3. OLEDB Connections
			a. Uses ADO (ActiveX Data Objects), which establishes a connection to the Made data sources exposed through OLE DB.
			b. Insure System DNS has active connections to QA-DBs using ODBC Driver 17 for SQL Server.
			c. Connection String can be obtained from Azure Portal via kv-made-shared-qa Key Vault.
        4. SmartBear License Manager
			a. Activate/Deactivate TestComplete Licenses.
        5. SmartBear TestComplete
			a. Automation IDE and Test Runner.
	```
 4. **Latest releases**
    ```
	a. SSMS	         -	version 18.9.2
	b. Git	         -	version 2.33.0
	c. VisualStudio  -	version 16.11.9
	d. dotNET        -  version 4.8.04084
    e. TestComplete  -  version 14.93.312
	```
 5. **Documentation**
    ```
	Additional TestComplete Documentation can be found in the [Automation Manifesto](../automation-manifesto.md)
	```