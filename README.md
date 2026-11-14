# SupportData-Front (kiosk support)

React + TypeScript + Vite + MUI. The screens talk to the SupportData backend (`api/...`).

## Run it

1. `npm install`
2. Copy `config.example.ts` to `config.ts` (it is git-ignored: it holds this machine's server addresses). The default
   `endpointMode = productionEndpoint` means "the API is on the same address as the app".
3. Start the backend (SupportData, default `http://localhost:5276`).
4. `npm run dev`. The dev server forwards `/api` and `/SupportFiles` to the backend, so there is nothing to set up for CORS.
   Another backend address: `VITE_BACKEND_URL=http://host:port npm run dev`.
5. Log in. A new database has the user `admin` / `admin123` (change it from the header, "تغییر رمز عبور").

`npm run build` = type check (`tsc -b`) + production build. It must pass before merging.

## Where things are

- `src/routes/` one file per screen (TanStack Router, file based). The sidebar and the access rules are in
  `src/data/layout-sidebar-data.ts` (`accessID` = the backend's permission id).
- `src/utility/accessCheck.ts` `useAccessCheck()`: module permissions (101-115) and operation permissions (201 and up).
  The permission list comes from the login response and lives in localStorage (too big for a cookie).
- `src/utility/session.ts` / `setupAxios.ts`: logout, and what happens when the server answers 401 (token expired).
- `src/hooks/use*Data.ts` the request hooks. The server answers business errors with HTTP 200 and `{ error != 0 }`:
  always check `res.error`. Use `mutateAsync(...).then(...)` (not callbacks of `mutate`) when the component can
  close or unmount before the reply arrives.
- `src/components/general/GeneralDialog.tsx` the generic add/edit form, `GeneralCrudPage.tsx` the generic list page.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

```
kms-front


├─ src
│  ├─ components
│  │  ├─ general
│  │  │  ├─ CustomCircularProgress.tsx
│  │  │  ├─ GeneralConfirmDialog.tsx
│  │  │  ├─ GeneralDeleteDialog.tsx
│  │  │  ├─ GeneralDialog.tsx
│  │  │  ├─ IconProvider.tsx
│  │  │  ├─ ImageComponent.tsx
│  │  │  ├─ LinearProgressWithLabel.tsx
│  │  │  ├─ StyledTooltip.tsx
│  │  │  ├─ SuspendDialog.tsx
│  │  │  ├─ TextWithTooltip.tsx
│  │  │  ├─ TypoGeneral.tsx
│  │  │  ├─ hookFromInputs
│  │  │  │  ├─ AutoComplete.tsx
│  │  │  │  ├─ CheckboxComp.tsx
│  │  │  │  └─ TextFieldComp.tsx
│  │  │  ├─ input
│  │  │  │  ├─ StyledAutoComplete.tsx
│  │  │  │  └─ StyledTextField.tsx
│  │  │  ├─ sidebar
│  │  │  │  ├─ Sidebar.tsx
│  │  │  │  ├─ SidebarFilterToolbar.tsx
│  │  │  │  ├─ SidebarToolbar.tsx
│  │  │  │  └─ index.ts
│  │  │  ├─ tree
│  │  │  │  ├─ TreeWrapper.tsx
│  │  │  │  └─ TreeWrapperItem.tsx
│  │  │  └─ uploadFile
│  │  │     ├─ UploadFile.tsx
│  │  │     ├─ UploadFileThumbnail.tsx
│  │  │     └─ index.ts
│  │  ├─ hoc
│  │  │  └─ withSnackbar.tsx
│  │  ├─ layout
│  │  │  ├─ Layout.tsx
│  │  │  ├─ LayoutBreadcrumbs .tsx
│  │  │  ├─ LayoutTopHeader.tsx
│  │  │  ├─ SidebarLayout.tsx
│  │  │  └─ index.ts
│  │  ├─ screen
│  │  │  └─ Login.tsx
│  │  └─ section
│  │     ├─ AssingKiosk.tsx
│  │     ├─ GeneralInfo.tsx
│  │     └─ users
│  │        └─ UserInfo.tsx
│  ├─ data
│  │  ├─ breadCrumbFr.ts
│  │  ├─ dialogArrays
│  │  │  ├─ kiosk.ts
│  │  │  └─ user.ts
│  │  ├─ kioskDefine
│  │  │  └─ configOptions.ts
│  │  ├─ layout-sidebar-data.ts
│  │  ├─ type
│  │  │  ├─ AutoCompletes.ts
│  │  │  ├─ NetworkTypes.ts
│  │  │  ├─ dialogArrayType.ts
│  │  │  ├─ infoOptionsType.ts
│  │  │  ├─ reactHookFormType.ts
│  │  │  ├─ resType.ts
│  │  │  ├─ signInType.ts
│  │  │  ├─ snackbarOpen.ts
│  │  │  ├─ uploadTypes.ts
│  │  │  └─ userType.ts
│  │  └─ validators
│  │     └─ validators.ts
│  ├─ hooks
│  │  ├─ useDeleteData.ts
│  │  ├─ useGetAuthorizationConfig.ts
│  │  ├─ useGetData.ts
│  │  ├─ usePostData.ts
│  │  ├─ usePutData.ts
│  │  ├─ useSignIn.ts
│  │  ├─ useSocket.ts
│  │  └─ useUploadData.ts
│  ├─ main.tsx
│  ├─ routeTree.gen.ts
│  ├─ routes
│  │  ├─ (dashboard)
│  │  │  ├─ (kioskManagement)
│  │  │  │  ├─ bank.tsx
│  │  │  │  ├─ device.tsx
│  │  │  │  ├─ kioskDefine.tsx
│  │  │  │  ├─ maintenance.tsx
│  │  │  │  └─ network.tsx
│  │  │  ├─ (systemManagement)
│  │  │  │  └─ users.tsx
│  │  │  ├─ (test)
│  │  │  │  └─ test.tsx
│  │  │  └─ kioskManagement.tsx
│  │  ├─ __root.tsx
│  │  └─ index.tsx
│  ├─ stories
│  │  ├─ Button.stories.ts
│  │  ├─ Button.tsx
│  │  ├─ Configure.mdx
│  │  ├─ Header.stories.ts
│  │  ├─ Header.tsx
│  │  ├─ Page.stories.ts
│  │  ├─ Page.tsx
│  │  ├─ assets
│  │  │  ├─ accessibility.png
│  │  │  ├─ accessibility.svg
│  │  │  ├─ addon-library.png
│  │  │  ├─ assets.png
│  │  │  ├─ avif-test-image.avif
│  │  │  ├─ context.png
│  │  │  ├─ discord.svg
│  │  │  ├─ docs.png
│  │  │  ├─ figma-plugin.png
│  │  │  ├─ github.svg
│  │  │  ├─ share.png
│  │  │  ├─ styling.png
│  │  │  ├─ testing.png
│  │  │  ├─ theming.png
│  │  │  ├─ tutorials.svg
│  │  │  └─ youtube.svg
│  │  ├─ button.css
│  │  ├─ header.css
│  │  └─ page.css
│  ├─ theme.tsx
│  ├─ utility
│  │  ├─ Highlighted.tsx
│  │  ├─ SvgComponent.tsx
│  │  ├─ findInTree.ts
│  │  ├─ getEndPoint.ts
│  │  ├─ handleRequestWithDelay.ts
│  │  ├─ removeProperties.ts
│  │  └─ sizeConverter.ts
│  └─ vite-env.d.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ yarn.lock

```