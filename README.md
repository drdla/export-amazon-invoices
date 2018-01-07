# Export Amazon Invoices

[Puppeteer](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md)-based crawler for exporting all invoices from a German Amazon account.

## Installation

Global dependencies: node and yarn.

Install project dependencies with `$ yarn`.

## Usage

Run project with `$ yarn export --email [email] --password [password] --year 2017`.

It will download all invoices as PDF files and place them in /output/[year]/.

### Options

-e, --email string The email of the Amazon account.
-p, --password string The password of the Amazon account.
-y, --year integer The four digit year or list of years for which to export the invoices.
Defaults to the current year.

### Examples

1. Export all invoices of the current year $ yarn export -e foo@bar.com -p test1234
2. Export all invoices of a given year $ yarn export -e foo@bar.com -p test1234 -y 2017
3. Export all invoices of multiple years $ yarn export -e foo@bar.com -p test1234 -y 2018 2017 2016

Project home: https://github.com/drdla/export-amazon-invoices
