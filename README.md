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