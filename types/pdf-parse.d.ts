declare module 'pdf-parse/lib/pdf-parse.js' {
    import { Buffer } from 'buffer';
    export interface PDFInfo {
      numpages: number;
      numrender: number;
      info: any;
      metadata: any;
      version: string;
      text: string;
    }
  
    export default function parse(dataBuffer: Buffer): Promise<PDFInfo>;
  }