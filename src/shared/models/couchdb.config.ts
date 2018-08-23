export interface CouchDbConfig {
  host: string;
  admin: {
    name: string;
    pass: string;
  };
  user?: {
    name: string;
    pass: string;
  }
}
