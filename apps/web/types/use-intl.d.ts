// TypeScript shim for missing use-intl types

declare module 'use-intl' {
  export type IntlFormats = any;
  export type IntlMessages = any;
  // Re-export everything the library normally provides (simplified)
  export function IntlProvider(props: any): JSX.Element;
  export function useTranslations(): any;
  export function createFormatter(): any;
  export function createTranslator(): any;
}
