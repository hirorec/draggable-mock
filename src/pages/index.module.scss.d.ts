export type Styles = {
  column: string;
  columnBg: string;
  columnBgBorder: string;
  container: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
