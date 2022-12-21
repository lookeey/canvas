import type { ThemeType } from "canvas-uikit";

declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {}
}
