# Accountancy Website Content Planner

Choose the clients and services that matter to your practice, then create a focused brief for your website content.

**For accountants and practice managers. No coding knowledge needed.**

[Open the free tool](https://accountant-web-design.github.io/practice-service-matrix/) · [See a fictional worked example](https://accountant-web-design.github.io/practice-service-matrix/examples/customer-output.html)

![Desktop preview](docs/preview.png)

## How to use it

1. Open the tool in your browser. No installation or account is needed.
2. Use your own business details in the labelled fields, or choose **Try a fictional example**.
3. Choose **Prepare my content brief** and review the result.
4. Adjust your answers, then copy the result, download a text file or choose **Print / Save PDF**.

A service-led content brief, with useful questions to answer before writing.

## What to expect

You know your clients and how your practice works. This turns that knowledge into a useful starting point for your website.

This is a website planning tool. It does not provide tax or accountancy advice, or invent credentials for your practice.

Your answers are processed in the browser tab. They are not uploaded, emailed or saved by the tool. Refreshing or closing the tab clears them. Save your result before leaving. GitHub provides hosting and handles normal request logs. Example details are fictional, not customer results.

## Design and maintenance

The interface uses the colours, typography and visual treatment of [Accountant Web Design](https://accountantwebdesign.uk/). The tool is maintained by Accountant Web Design, operated by JW Digital Services Ltd. The commercial website is a separate project.

## For developers

The customer tool uses native HTML controls and small browser modules, with no runtime framework. Its planning or calculation rules are in `src/customer.js`; presentation helpers are in `src/customer-ui.js`.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run serve
```

Open the local address printed by the server. `npm run build:pages` prepares the static GitHub Pages artifact. Tests cover the customer rules and output escaping.

The original v0.1 developer helpers remain in `src/index.js` for compatibility, with their original examples. They are not needed to use the customer tool. The existing repository name and Pages URL are retained so earlier links keep working.

## Licence and feedback

MIT for tool code. Bundled typefaces retain their original licence notices in `demo/assets/font-licences`. [Ideas and feedback](https://github.com/Accountant-Web-Design/practice-service-matrix/discussions/1).
