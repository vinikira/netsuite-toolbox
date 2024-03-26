# netsuite-toolsuite
A Firefox extentions that is a suite of tools for use with NetSuite. 

Forked from the NetSuite-Toolbox extension. 

## Installation
[Click here](https://addons.mozilla.org/firefox/addon/netsuite-toolsuite/) and then click on "Add to Firefox" button.

## Features

### Current Record Load
Record is loaded with N/currentRecord and storaged in window.recordLoaded. You can then access that from the console then as you need.

### Copy Field ID
Copies field ID when ```Shift + LeftClick``` is used on field.

### Find field by ID
Find field on record page by id. To activate use ```Ctrl + Shift + f```.

### Field field by label
Find field on record page by label. To activate use ```Ctrl + Shift + l```.

### Export search to JSON
Exports search page (on edit mode) to JSON and show this in NetSuite dialog modal. If you want to show with syntax highlight (with native firefox json viewer) is just click on "Open in new tab".

### Export record to JSON
Exports record page to JSON and show in new tab with syntax highlight (with native firefox json viewer).

### Enable/Disable Field
Allow to enable/disable fields in edit mode. This effect is temporary, when page is refreshed, all is reseted.

### Load SS2 modules
Insert modules on prompt (separated by commas) and load this to ```window[module-name]``` object. The module names on window object is ```N/``` free, but the inserted modules on prompt must be with ```N/```.
