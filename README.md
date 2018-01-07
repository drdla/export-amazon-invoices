# Export Amazon Invoices

[Puppeteer](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md)-based crawler for exporting all invoices from a German Amazon account.

## Installation

Global dependencies: node and yarn.

Install project dependencies with `$ yarn`.

## Usage

Run project with `$ yarn export --email [email] --password [password] --year 2017`.

It will download all invoices as PDF files and place them in /output/[year]/.
