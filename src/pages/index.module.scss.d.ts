export type Styles = {
  button: string;
  buttons: string;
  container: string;
  select: string;
  selected: string;
  ui: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
