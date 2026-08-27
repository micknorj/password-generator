# Password Generator

Part of **Mick's Tools**.

A privacy-focused password generator that runs entirely in your browser using cryptographically secure randomness.

## Features

- Cryptographically secure password generation
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

## Local processing

Passwords and settings are processed entirely inside your browser and are not sent to a server by this application.

The site is hosted using GitHub Pages, which may process standard connection information as part of hosting and security.

## Security

Random values are generated using the browser's Web Crypto API through `crypto.getRandomValues()`.

## License

This project is licensed under the MIT License. See `LICENSE`.
