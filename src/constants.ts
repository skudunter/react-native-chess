import { Dimensions, Platform } from "react-native";

export const SCREENWIDTH : number = Dimensions.get("window").width;
export const SCREENHEIGHT : number = Dimensions.get("window").height;
export const OS = Platform.OS;
export const PRIMARYCOLOR = "#04080F";
export const SECONDARYCOLOR = "#507dbc";
export const TERSIARYCOLOR = "#DAE3E5";
export const  FOURTHCOLOR = "#BBD1EA"
export const FIFTHCOLOR = "#86615C"
export const TILEWIDTH : number = (OS === 'web'? SCREENWIDTH/24: SCREENWIDTH / 8);
export type PeiceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k' | 'P' | 'R' | 'N' | 'B' | 'Q' | 'K' | null;

// 04080F 507dbc A1C6EA BBD1EA DAE3E5
