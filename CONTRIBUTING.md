## Contributing

[fork]: /fork
[pr]: /compare
[style]: https://standardjs.com/

Hi there! I am thrilled that you'd like to contribute to this project. Your help is essential for keeping it great.

## Setting up the environment

1. [Fork][fork] and clone the repository.
1. Configure and install the dependencies: `npm install` (you need to have node.js installed, I use v14.17.4).
1. Run the project with `npm run start`

The project is built using Angular 9 and NgRx 10. Check the official guides if you need help.

To edit the data ([i18n](./i18n) or [Wingspan card list](./scripts/wingspan-card-list.xlsx)), python with Jupyter notebook is required to transform it to the json files.
New files in [generated](./scripts/generated/) folder have to be formatted and moved to the [assets](./src/assets/data/) folder.

## Submit a pull request
1. Make your change, add tests, and make sure the tests still pass.
1. Make sure to test the app locally.
1. Create a new branch: `git checkout -b my-branch-name`.
1. Push to your fork and [submit a pull request][pr].
1. Pat your self on the back and wait for your pull request to be reviewed and merged.
