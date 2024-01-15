# IN5320_dhis2_project

This application was developed as a group project by:

- Andrea Arstad Helmersen (andrahe)
- Theresa Phuong Pham (tppham)
- Viktoria Liao (viktorli)
- Tollev Sauar (tollevsa)
- Zhara B. Rezai (zharabr)

The project is bootstrapped using the [DHIS2 Application Platform](https://github.com/dhis2/app-platform). This [video](https://www.youtube.com/watch?v=WP6ZWbsTz-Q&list=PLo6Seh-066Rze0f3zo-mIRRueKdhw4Vnm&index=4) provides a further introduction to application development with DHIS2, although it is not required for setting up, nor running, the application. 
  
## A BRIEF DESCRIPTION OF DHIS2
DHIS2 is a free software platform that provides an open-source development service. It is developed by the HISP Centre at UiO and is mostly used as an information system for health management. However, it can also be used for managing and analyzing data for any purpose. [This](https://dhis2.org/about/) site provides more information about the DHIS2 platform. 
  
## PREREQUISITES
node and yarn have to be installed on your computer to set up the application. They can be installed following the [node.js setup guide](https://dhis2-app-course.ifi.uio.no/learn/getting-started/development-setup/nodejs/).

Following this, the DHIS2 dependencies have to be installed. To install them globally, one can run the following command: 
```
yarn global add @dhis2/cli
```

Additionally, most browsers will require a request to a third-party resource (we use the DHIS2 instance). We do this by utilizing the dhis-portal tool. This can be installed by running the following command: 
```
yarn global add dhis-portal
```
  
## FIRST TIME SETUP 
Make sure to import all the necessary dependencies: 
```
yarn install
```

Set up the DHIS2 proxy:
```
npx dhis-portal --target=https://data.research.dhis2.org/in5320/
```

Start the application by running the following command in the project directory:
```
yarn start
```

Your browser should then open up a DHIS2 instance on localhost:3000. The login credentials are: 
Server: localhost:9999
Username: admin
Password: district
  
## THE APPLICATION

The application implements necessary functionalities for health clinics in Whotopia to utilize DHIS2 for digital stock management. Whotopia is a fictional country, and our group was assigned the Baama CHC (Community Health Center). The case description can be found [here]( https://www.uio.no/studier/emner/matnat/ifi/IN5320/h23/project/case-1/index.html).
  
### FUNCTIONALITIES
You can find the following functionalities in the application:

Upon launching the application, users are greeted by a front page, <i>Overview</i>, providing an outline of commodity trends for Baama CHC, days until the next shipment, the number of commodities dispensed for the current month, and a table for the stock balance sheet. To the left, a vertical navigation bar offers access to other pages where different functionalities can be performed.

The <i>Commodities</i> section displays a table presenting available commodities, the quantity consumed, remaining quantity of the given commodity, and the size of the order placed for that commodity. It also allows users to update the order quantity for each commodity in stock.

The <i>Dispense</i> function enables users to record information regarding the commodities distributed to healthcare professionals upon their requests. Above the registration form, there is a button, Transaction history, which opens a pop-up window displaying a table with information on all previously performed dispenses. This pop-up function displaying the transaction history is also available for <i>Replenish</i> and <i>Recount</i>.

*Replenish* allows the store manager to update the new stock balance upon receiving stock deliveries.

*Recount* enables users to ensure that the recorded inventory matches the physical inventory by providing the option to update the count of items in stock without necessarily having received a new stock delivery or performed a dispense. The functionality displaying transaction history can also be useful to keep track of items that are frequently misregistered.

  
### HOW WE IMPLEMENTED THE FUNCTIONALITIES

All components are rendered inside our data context provider component, which handles the retrieval of all data upon mounting. All necessary API calls to get data are executed only once during mount/startup to fetch commodity data from the “life saving commodities” data set and transaction data from datastore. All components that are child components of the data context provider have access to commodity data (merged data) and transaction data, along with functions to locally set/modify them. The commodity data is used to display information about the commodities in various places in our application. The transaction data is used to display transaction history for *Dispense, Replenish* and *Recount*.

Each time we do a PUT call to the api we launch a snackbar that says if the action was successful or not. This way, the user gets feedback for their actions. 

To store transaction history for dispensing, replenishing, and recounting, we utilized a datastore. This decision was prompted by the inadequacy of the APIs dataValueSets, dataSets, and organisationUnits, as they did not store the necessary values. To persist the data, we created a namespace, IN5320-5, and assigned a key to each functionality—dispenseTransactions, replenishTransactions, and recountTransactions.

We have also endeavored to ensure that most components are reusable to maintain consistency in the app and the code. This design consistency enhances the user experience and benefits developers in terms of efficiency, code readability, easier maintenance, and testing. Forms and DataTables are examples of reused components in the app.
  
## MISSING AND/OR NON-OPTIMIZED FUNCTIONALITIES

These are some improvements we would implement if we would have more time:

- We assumed that the API resets itself every month; if time permitted, commodities dispense would have been reset.
- We did not take into account that the user may have wanted to replenish the stock balance of several different commodities at once. 
- Possible for the user to choose between registered health personnel users and departments in the system rather than typing it manually to prevent spelling mistakes.
- Snackbar does not disappear on its own if the notification is red (requires clicking the 'x' to close).
- Fix the issue where updating quantity to order causes the entire table to shift to the left.
- We have not taken into consideration if the datastore is empty, because we get the list from datastore and add to this list. 
