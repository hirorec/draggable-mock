export type Styles = {
  header: string;
  headerCell: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
