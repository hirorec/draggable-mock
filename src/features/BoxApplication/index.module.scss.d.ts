export type Styles = {
  application: string;
  applicationInner: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
