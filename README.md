# Export Amazon Invoices

[Puppeteer](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md)-based crawler for mass exporting invoices from a German Amazon account.

## Installation

Global dependencies: node and yarn.

Install project dependencies with `$ yarn`.

## Usage

Run project with `$ yarn export --user [user] --password [password] --year [year]`.

It will download all invoices as PDF files and place them in /output/[year]/.

Type `$ yarn export` to view options and examples.
