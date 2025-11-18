import { PostgreSQLConnector } from '@/lib/connections/connectors/PostgreSQLConnector'
import { Client } from 'pg'

// Mock the pg module
jest.mock('pg', () => ({
  Client: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    end: jest.fn(),
    query: jest.fn(),
  })),
}))

describe('PostgreSQLConnector', () => {
  let connector: PostgreSQLConnector
  let mockClient: jest.Mocked<Client>

  const mockConfig = {
    host: 'localhost',
    port: 5432,
    database: 'test_db',
    user: 'test_user',
    password: 'test_password',
  }

  beforeEach(() => {
    mockClient = new Client() as jest.Mocked<Client>
    ;(Client as jest.Mock).mockReturnValue(mockClient)
    
    connector = new PostgreSQLConnector('test-id', mockConfig)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Constructor', () => {
    it('should create connector with valid configuration', () => {
      expect(connector).toBeInstanceOf(PostgreSQLConnector)
      expect(connector.getId()).toBe('test-id')
      expect(connector.getType()).toBe('postgresql')
    })

    it('should throw error with invalid configuration', () => {
      expect(() => {
        new PostgreSQLConnector('test', {
          host: '',
          port: 0,
          database: '',
          user: '',
          password: '',
        })
      }).toThrow('Invalid PostgreSQL configuration')
    })
  })

  describe('Connection Management', () => {
    it('should connect successfully', async () => {
      mockClient.connect.mockResolvedValue(undefined)
      
      const result = await connector.connect()
      
      expect(result).toBe(true)
      expect(mockClient.connect).toHaveBeenCalledTimes(1)
      expect(connector.isConnected()).toBe(true)
    })

    it('should handle connection failure', async () => {
      const error = new Error('Connection failed')
      mockClient.connect.mockRejectedValue(error)
      
      await expect(connector.connect()).rejects.toThrow('Connection failed')
      expect(connector.isConnected()).toBe(false)
    })

    it('should disconnect successfully', async () => {
      mockClient.end.mockResolvedValue()
      
      // Connect first
      mockClient.connect.mockResolvedValue(undefined)
      await connector.connect()
      
      const result = await connector.disconnect()
      
      expect(result).toBe(true)
      expect(mockClient.end).toHaveBeenCalledTimes(1)
      expect(connector.isConnected()).toBe(false)
    })

    it('should handle disconnect failure gracefully', async () => {
      const error = new Error('Disconnect failed')
      mockClient.end.mockRejectedValue(error)
      
      // Connect first
      mockClient.connect.mockResolvedValue(undefined)
      await connector.connect()
      
      const result = await connector.disconnect()
      
      expect(result).toBe(false)
      expect(connector.isConnected()).toBe(false)
    })
  })

  describe('Connection Testing', () => {
    it('should test connection successfully', async () => {
      mockClient.query.mockResolvedValue({ rows: [{ version: 'PostgreSQL 13.0' }] })
      
      const result = await connector.testConnection()
      
      expect(result.success).toBe(true)
      expect(result.message).toContain('PostgreSQL 13.0')
      expect(mockClient.query).toHaveBeenCalledWith('SELECT version();')
    })

    it('should handle connection test failure', async () => {
      const error = new Error('Query failed')
      mockClient.query.mockRejectedValue(error)
      
      const result = await connector.testConnection()
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Query failed')
    })
  })

  describe('Query Execution', () => {
    beforeEach(async () => {
      mockClient.connect.mockResolvedValue(undefined)
      await connector.connect()
    })

    it('should execute SELECT query successfully', async () => {
      const mockRows = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ]
      
      mockClient.query.mockResolvedValue({ 
        rows: mockRows, 
        rowCount: mockRows.length,
        command: 'SELECT',
        oid: 0,
        fields: []
      })
      
      const result = await connector.executeQuery('SELECT * FROM users')
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockRows)
      expect(result.count).toBe(2)
    })

    it('should execute INSERT query successfully', async () => {
      mockClient.query.mockResolvedValue({ 
        rows: [], 
        rowCount: 1,
        command: 'INSERT',
        oid: 12345,
        fields: []
      })
      
      const result = await connector.executeQuery(
        "INSERT INTO users (name) VALUES ('John')"
      )
      
      expect(result.success).toBe(true)
      expect(result.count).toBe(1)
    })

    it('should handle query execution failure', async () => {
      const error = new Error('Syntax error')
      mockClient.query.mockRejectedValue(error)
      
      const result = await connector.executeQuery('INVALID SQL')
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Syntax error')
    })

    it('should throw error when not connected', async () => {
      // Disconnect first
      await connector.disconnect()
      
      await expect(
        connector.executeQuery('SELECT 1')
      ).rejects.toThrow('Not connected to PostgreSQL')
    })
  })

  describe('Schema Operations', () => {
    beforeEach(async () => {
      mockClient.connect.mockResolvedValue(undefined)
      await connector.connect()
    })

    it('should retrieve schema information', async () => {
      const mockSchema = [
        {
          table_name: 'users',
          column_name: 'id',
          data_type: 'integer',
          is_nullable: 'NO',
        },
        {
          table_name: 'users',
          column_name: 'name',
          data_type: 'varchar',
          is_nullable: 'YES',
        },
      ]
      
      mockClient.query.mockResolvedValue({ 
        rows: mockSchema,
        rowCount: mockSchema.length,
        command: 'SELECT',
        oid: 0,
        fields: []
      })
      
      const result = await connector.getSchema()
      
      expect(result).toEqual(mockSchema)
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('information_schema.columns')
      )
    })

    it('should handle schema retrieval failure', async () => {
      const error = new Error('Permission denied')
      mockClient.query.mockRejectedValue(error)
      
      await expect(connector.getSchema()).rejects.toThrow('Permission denied')
    })
  })

  describe('Transaction Support', () => {
    beforeEach(async () => {
      mockClient.connect.mockResolvedValue(undefined)
      await connector.connect()
    })

    it('should execute transaction successfully', async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'BEGIN', oid: 0, fields: [] })
        .mockResolvedValueOnce({ rows: [], rowCount: 1, command: 'INSERT', oid: 0, fields: [] })
        .mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'COMMIT', oid: 0, fields: [] })

      const queries = ["INSERT INTO users (name) VALUES ('John')"]
      const result = await connector.executeTransaction(queries)

      expect(result.success).toBe(true)
      expect(mockClient.query).toHaveBeenCalledWith('BEGIN')
      expect(mockClient.query).toHaveBeenCalledWith(queries[0])
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT')
    })

    it('should rollback transaction on error', async () => {
      const error = new Error('Constraint violation')
      
      mockClient.query
        .mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'BEGIN', oid: 0, fields: [] })
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'ROLLBACK', oid: 0, fields: [] })

      const queries = ["INSERT INTO users (name) VALUES ('John')"]
      const result = await connector.executeTransaction(queries)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Constraint violation')
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK')
    })
  })

  describe('Performance and Memory', () => {
    beforeEach(async () => {
      mockClient.connect.mockResolvedValue(undefined)
      await connector.connect()
    })

    it('should handle large result sets efficiently', async () => {
      const largeDataSet = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        data: `large_data_${i}`,
      }))
      
      mockClient.query.mockResolvedValue({ 
        rows: largeDataSet, 
        rowCount: largeDataSet.length,
        command: 'SELECT',
        oid: 0,
        fields: []
      })
      
      const startTime = process.hrtime.bigint()
      const result = await connector.executeQuery('SELECT * FROM large_table')
      const endTime = process.hrtime.bigint()
      
      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(10000)
      
      // Should complete within reasonable time (< 1 second)
      const executionTime = Number(endTime - startTime) / 1_000_000 // Convert to ms
      expect(executionTime).toBeLessThan(1000)
    })

    it('should properly clean up resources', async () => {
      await connector.disconnect()
      
      expect(mockClient.end).toHaveBeenCalledTimes(1)
      expect(connector.isConnected()).toBe(false)
    })
  })

  describe('Security', () => {
    it('should sanitize configuration for logging', () => {
      const sanitized = connector.getSanitizedConfig()
      
      expect(sanitized).not.toContain('test_password')
      expect(sanitized).toContain('test_user')
      expect(sanitized).toContain('localhost')
      expect(sanitized).toContain('test_db')
    })

    it('should validate query parameters', async () => {
      mockClient.connect.mockResolvedValue(undefined)
      await connector.connect()
      
      // Test with potentially dangerous query
      await expect(
        connector.executeQuery("SELECT * FROM users WHERE id = '; DROP TABLE users; --")
      ).rejects.toThrow('Potentially dangerous query detected')
    })
  })
})