declare namespace Express {
  export interface Request {
    rawBody: any;
    user?: any;
  }
  export interface Application {
    mailer: any;
  }
}
