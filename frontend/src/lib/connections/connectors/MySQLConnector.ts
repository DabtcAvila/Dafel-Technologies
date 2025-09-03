/**
 * MySQL Connector (Stub Implementation)
 * @module lib/connections/connectors/MySQLConnector
 */

import { BaseConnector } from './BaseConnector';
import { QueryResult } from '../types';

export class MySQLConnector extends BaseConnector {
  public readonly type = 'MYSQL';
  private connected = false;

  public async connect(): Promise<void> {
    this.logger.info('MySQL connector not yet implemented', { connectionId: this.id });
    this.connected = true;
    this.metadata.isHealthy = true;
    this.metadata.connectedAt = new Date();
  }

  public async disconnect(): Promise<void> {
    this.connected = false;
    this.metadata.isHealthy = false;
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public async query<T = any>(query: string | object, params?: any[]): Promise<QueryResult<T>> {
    return {
      success: false,
      error: 'MySQL connector not yet implemented',
    };
  }

  public async transaction<T = any>(
    queries: Array<{ query: string | object; params?: any[] }>
  ): Promise<QueryResult<T>[]> {
    return queries.map(() => ({
      success: false,
      error: 'MySQL connector not yet implemented',
    }));
  }
}