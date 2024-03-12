export type Styles = {
  button: string;
  buttons: string;
  container: string;
  selected: string;
  ui: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
