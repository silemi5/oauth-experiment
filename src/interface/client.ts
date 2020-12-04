/**
 * Client Interface
 * 
 * Reference: https://tools.ietf.org/html/rfc7591
 */

export interface ClientMetadata {
  client_id?: string;
  client_name: string;
  client_uri?: string;
  client_description?: string;
  logo_uri?: string;
  client_id_issued_at?: number;
  client_secret?: string;
  client_secret_expires_at?: number;
  application_type?: 'web' | 'native' | 'browser' | 'service';
  redirect_uris?: string[];
  response_types?: string[];
  grant_types?: [ 'authorization_code' | 'implicit' | 'password' | 'refresh_token' | 'client_credentials' ];
  policy_uri?: string;
}

export interface AuthorizationRequest {
  client_id: string;
  response_types: [ 'code' | 'token' ];
  redirect_uri?: string;
  scope?: string;
  state?: string;
}

export interface AuthorizationWhileLoggedInRequest extends AuthorizationRequest {
  username: string;
  password: string;
}
