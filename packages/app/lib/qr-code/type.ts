import { ImageSourcePropType } from "react-native";

import { QRCodeErrorCorrectionLevel } from "qrcode";

export interface QRCodeProps {
  /* what the qr code stands for */
  value?: string;
  /* the whole component size */
  size: number;
  /* the color of the background */
  backgroundColor?: string;
  /* an image source object. example {uri: 'base64string'} or {require('pathToImage')} */
  logo?: ImageSourcePropType;
  /* logo size in pixels */
  logoSize?: number;
  /* the logo gets a filled rectangular background with this color. Use 'transparent'
         if your logo already has its own backdrop. Default = same as backgroundColor */
  logoBackgroundColor?: string;
  /* logo's distance to its wrapper */
  logoMargin?: number;
  /* get svg ref for further usage */
  getRef?: (c: any) => any;
  /* error correction level */
  ecl?: QRCodeErrorCorrectionLevel;
  /* error handler called when matrix fails to generate */
  onError?: Function;
  /* 
   qrcode dot and background color, default is
   dark: ["black", "white"] 
   light: ["white", "black"]
  */
  fillColors?: string[];
}
