export type Styles = {
  column: string;
  columnBg: string;
  columnBgBorder: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
