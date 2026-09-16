# Password Generator

Part of Mick's Tools.

A password generator that creates passwords locally in your browser using cryptographically secure randomness.

## Features

- Custom password length and quantity
- Optional fixed prefix
- Uppercase, lowercase, numbers and symbols
- Custom symbol pool
- Optional exclusion of ambiguous characters
- Generate up to 100 passwords at once
- Copy individual passwords or copy all
- Dark, light and system appearance
- Responsive layout
- No analytics or tracking
- No server-side password processing

## Privacy

Passwords and settings are processed inside your browser and are not sent to a server by this application.

The site is hosted on [GitHub Pages](https://pages.github.com/), which may process standard connection information for hosting and security.

## Security

Random values are generated with the browser [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) through `crypto.getRandomValues()`.

## Limitations

- Up to 100 passwords can be generated at once
- The generator does not store or manage passwords for you

## License

Licensed under the [MIT License](LICENSE).
