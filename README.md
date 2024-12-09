<div align="center">

![JPA](./assets/jpa.png)

Clash With JPA

</div>

## 🚀 Installation

1. Clone this repository
    ```sh
    git clone https://github.com/clashwithjpa/clashwithjpa.com clashwithjpa
    cd clashwithjpa
    ```

2. Install dependencies
    ```sh
    npm i
    ```

3. Start the app
    ```sh
    npm run dev
    ```

## 🌐 Production

1. Follow steps 1 & 2 from the [installation guide](#-installation). _Ignore if already done._

2. Build the app
    ```sh
    npm run build
    ```

3. Preview the app
    ```sh
    npm run preview
    ```

## ✏️ Editing Data

Now that you have the app running, you can edit the data in the [`data`](./data/) directory. You can add, edit, or delete any file in the [`data`](./data/) directory. The app will automatically update the data.
- [`clans.json`](./data/clans.json): Contains the list of clans tags and requirements.
- [`clans/<clan-tag>.md`](./data/clans/): Contains the requirements for the clan with the specified tag.
- [`clans/components`](./data/clans/components/): Contains information which are common for all clans.
- [`clans/components/order.json`](./data/clans/components/order.json): Contains the order of common components to be displayed in the clan page.

- How to add a new clan?
    - Add the clan tag in the [`clans.json`](./data/clans.json) file.
    - Create a new file in the [`clans`](./data/clans/) directory with the name `<clan-tag>.md`.
    - Add the requirements in the newly created file.

- How to edit clan requirements?
    - Open the [`clans.json`](./data/clans.json) file and find the clan tag.
    - Add/Remove requirements in the respective of label names in [`static/labels`](./static/labels/) directory.
> [!IMPORTANT]
> The label name declared in the [`clans.json`](./data/clans.json) file should match the file name in the [`static/labels`](./static/labels/) directory.
    - Do the necessary changes in `<clan-tag>.md` file.

## ⌨️ Contributing

- Things to keep in mind
    - Follow our commit message convention.
    - Write meaningful commit messages.
    - Keep the code clean and readable.
    - Make sure the app is working as expected.

- Code Formatting
    - Run `npm run format` before committing your changes or use [`Prettier`](https://prettier.io/) extension in your code editor.
    - Make sure to fix all the linting errors. Run `npm run lint` to check for linting errors.
