# Practice Service Matrix

Practice Service Matrix helps an accountancy firm plan clear website explanations of its services. Record the clients a service is for, what is included, what needs confirmation and how a prospective client should get in touch.

The output is a content brief for the practice to review. It does not provide tax or accounting advice. Maintained by [Accountant Web Design](https://accountantwebdesign.uk/), operated by JW Digital Services Ltd.

![Complete example](docs/preview.png)

## Start locally

Requires Node.js 22 or later. No runtime dependencies or account required.

```sh
npm ci
npm test
npm run build
npm run serve
```

Open http://127.0.0.1:4173/ for the complete local demonstration. Browser examples do not upload or persist entered data. The optional development server binds to loopback only.

## Input and output

Supply practice and rows with service, client_type, client_question, scope, inclusions, exclusions, evidence_needed, next_step and content_owner. claims is an optional list of {text, approved}. Rows produce a brief, not a page-per-row recommendation.

Use [examples/input.json](examples/input.json) as the complete input contract. Compare the generated [JSON result](examples/output.json), [Markdown report](examples/output.md) and [complete HTML](examples/output.html). The demo is in [demo/index.html](demo/index.html). It needs the local server for JavaScript modules. HTML reports can be opened as standalone files.

```sh
node cli.mjs examples/input.json --format json
node cli.mjs examples/input.json --format html --output report.html
node cli.mjs examples/input.json --format md --output report.md
```

This resource uses nested JSON input. See the complete example and `node cli.mjs --help`.

## Worked example

Use a fictional practice serving sole traders, small limited companies and charities. Include bookkeeping, payroll and annual accounts as sample service labels, without deadlines, tax rates or accounting advice. One row should lack an evidence owner; two should share a question that belongs in the same explanation. Show how the output groups these correctly.

All supplied example records are synthetic. No clients, outcomes, current professional advice or real service availability are represented by them. Keep real records private and review output before sharing it.

## Checks

- Required fields and duplicate rows produce useful validation messages, without deleting entered content.
- Shared questions group predictably. The tool does not create new page recommendations merely because a row exists.
- Unapproved claims and missing evidence owners stay marked as review work in the generated brief.
- CSV quoting, commas, line breaks and Unicode survive import and export. Spreadsheet exports neutralise formula-like input.
- The example can be reproduced locally without a login, API key or document upload.

The automated results and browser checks performed for this release are recorded in [verification.md](docs/verification.md). Manual screen-reader testing has not been performed. A passing automated check is not accessibility certification.

## Contribute and maintain

Use [Issues](https://github.com/Accountant-Web-Design/practice-service-matrix/issues) for a reproducible bug and [Discussions](https://github.com/Accountant-Web-Design/practice-service-matrix/discussions) for questions and improvements. Follow [CONTRIBUTING.md](CONTRIBUTING.md); report vulnerabilities privately using [SECURITY.md](SECURITY.md). See [CHANGELOG.md](CHANGELOG.md) for releases. Maintenance is best effort.

Code, original illustrations and synthetic fixtures are MIT licensed. There is no required website backlink when reusing the resource. Commercial brand assets and third-party material are not included.
