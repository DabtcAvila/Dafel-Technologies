import { VaultManager } from '@/lib/security/VaultManager'

// Mock crypto module
const mockCrypto = {
  randomBytes: jest.fn(),
  createCipher: jest.fn(),
  createDecipher: jest.fn(),
  pbkdf2Sync: jest.fn(),
  createHash: jest.fn(),
}

jest.mock('crypto', () => mockCrypto)

describe('VaultManager', () => {
  let vaultManager: VaultManager

  beforeEach(() => {
    vaultManager = new VaultManager()
    jest.clearAllMocks()
  })

  describe('Key Generation', () => {
    it('should generate secure random keys', async () => {
      const mockKey = Buffer.from('mock-secure-key-32-bytes-long-!!!')
      mockCrypto.randomBytes.mockReturnValue(mockKey)

      const key = await vaultManager.generateKey()

      expect(mockCrypto.randomBytes).toHaveBeenCalledWith(32)
      expect(key).toBe(mockKey.toString('base64'))
    })

    it('should generate different keys on each call', async () => {
      mockCrypto.randomBytes
        .mockReturnValueOnce(Buffer.from('first-key-32-bytes-long-!!!!!'))
        .mockReturnValueOnce(Buffer.from('second-key-32-bytes-long-!!!!'))

      const key1 = await vaultManager.generateKey()
      const key2 = await vaultManager.generateKey()

      expect(key1).not.toBe(key2)
      expect(mockCrypto.randomBytes).toHaveBeenCalledTimes(2)
    })

    it('should handle key generation errors', async () => {
      const error = new Error('Random number generation failed')
      mockCrypto.randomBytes.mockImplementation(() => {
        throw error
      })

      await expect(vaultManager.generateKey()).rejects.toThrow(
        'Random number generation failed'
      )
    })
  })

  describe('Encryption', () => {
    const mockPlaintext = 'sensitive-data-to-encrypt'
    const mockEncryptedData = 'encrypted-data-mock'
    const mockKey = 'mock-encryption-key'

    beforeEach(() => {
      const mockCipher = {
        update: jest.fn().mockReturnValue('encrypted-'),
        final: jest.fn().mockReturnValue('data-mock'),
      }
      
      mockCrypto.createCipher.mockReturnValue(mockCipher)
    })

    it('should encrypt data successfully', async () => {
      const result = await vaultManager.encrypt(mockPlaintext, mockKey)

      expect(mockCrypto.createCipher).toHaveBeenCalledWith('aes-256-cbc', mockKey)
      expect(result).toBe('encrypted-data-mock')
    })

    it('should handle empty string encryption', async () => {
      const result = await vaultManager.encrypt('', mockKey)

      expect(result).toBe('encrypted-data-mock')
      expect(mockCrypto.createCipher).toHaveBeenCalled()
    })

    it('should throw error with invalid key', async () => {
      await expect(
        vaultManager.encrypt(mockPlaintext, '')
      ).rejects.toThrow('Encryption key cannot be empty')
    })

    it('should handle encryption errors', async () => {
      const error = new Error('Encryption failed')
      mockCrypto.createCipher.mockImplementation(() => {
        throw error
      })

      await expect(
        vaultManager.encrypt(mockPlaintext, mockKey)
      ).rejects.toThrow('Encryption failed')
    })
  })

  describe('Decryption', () => {
    const mockEncryptedData = 'encrypted-data-to-decrypt'
    const mockDecryptedData = 'decrypted-sensitive-data'
    const mockKey = 'mock-decryption-key'

    beforeEach(() => {
      const mockDecipher = {
        update: jest.fn().mockReturnValue('decrypted-'),
        final: jest.fn().mockReturnValue('sensitive-data'),
      }
      
      mockCrypto.createDecipher.mockReturnValue(mockDecipher)
    })

    it('should decrypt data successfully', async () => {
      const result = await vaultManager.decrypt(mockEncryptedData, mockKey)

      expect(mockCrypto.createDecipher).toHaveBeenCalledWith('aes-256-cbc', mockKey)
      expect(result).toBe('decrypted-sensitive-data')
    })

    it('should handle empty encrypted data', async () => {
      const result = await vaultManager.decrypt('', mockKey)

      expect(result).toBe('decrypted-sensitive-data')
      expect(mockCrypto.createDecipher).toHaveBeenCalled()
    })

    it('should throw error with invalid key', async () => {
      await expect(
        vaultManager.decrypt(mockEncryptedData, '')
      ).rejects.toThrow('Decryption key cannot be empty')
    })

    it('should handle decryption errors', async () => {
      const error = new Error('Decryption failed')
      mockCrypto.createDecipher.mockImplementation(() => {
        throw error
      })

      await expect(
        vaultManager.decrypt(mockEncryptedData, mockKey)
      ).rejects.toThrow('Decryption failed')
    })
  })

  describe('Secure Storage', () => {
    it('should store data securely', async () => {
      const key = 'test-key'
      const data = { username: 'admin', password: 'secret' }
      
      // Mock encryption
      mockCrypto.randomBytes.mockReturnValue(Buffer.from('mock-salt-16-bytes!'))
      mockCrypto.pbkdf2Sync.mockReturnValue(Buffer.from('derived-key-32-bytes-long-!!!!!!'))
      
      const mockCipher = {
        update: jest.fn().mockReturnValue('encrypted-'),
        final: jest.fn().mockReturnValue('data'),
      }
      mockCrypto.createCipher.mockReturnValue(mockCipher)

      const result = await vaultManager.secureStore(key, data)

      expect(result.success).toBe(true)
      expect(result.id).toBeDefined()
      expect(mockCrypto.pbkdf2Sync).toHaveBeenCalled()
      expect(mockCrypto.createCipher).toHaveBeenCalled()
    })

    it('should retrieve stored data securely', async () => {
      const key = 'test-key'
      const originalData = { username: 'admin', password: 'secret' }
      
      // Mock the complete store/retrieve cycle
      mockCrypto.randomBytes.mockReturnValue(Buffer.from('mock-salt-16-bytes!'))
      mockCrypto.pbkdf2Sync.mockReturnValue(Buffer.from('derived-key-32-bytes-long-!!!!!!'))
      
      const mockCipher = {
        update: jest.fn().mockReturnValue('encrypted-'),
        final: jest.fn().mockReturnValue('data'),
      }
      const mockDecipher = {
        update: jest.fn().mockReturnValue('{"username":"admin",'),
        final: jest.fn().mockReturnValue('"password":"secret"}'),
      }
      
      mockCrypto.createCipher.mockReturnValue(mockCipher)
      mockCrypto.createDecipher.mockReturnValue(mockDecipher)

      // Store data
      const storeResult = await vaultManager.secureStore(key, originalData)
      
      // Retrieve data
      const retrieveResult = await vaultManager.secureRetrieve(storeResult.id!, key)

      expect(retrieveResult.success).toBe(true)
      expect(JSON.parse(retrieveResult.data!)).toEqual(originalData)
    })

    it('should handle invalid storage key', async () => {
      const result = await vaultManager.secureStore('', { test: 'data' })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Storage key cannot be empty')
    })

    it('should handle retrieval of non-existent data', async () => {
      const result = await vaultManager.secureRetrieve('non-existent-id', 'key')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Data not found')
    })
  })

  describe('Hash Generation', () => {
    it('should generate consistent hashes', async () => {
      const mockHash = {
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('consistent-hash-value'),
      }
      mockCrypto.createHash.mockReturnValue(mockHash)

      const input = 'data-to-hash'
      const hash1 = await vaultManager.generateHash(input)
      const hash2 = await vaultManager.generateHash(input)

      expect(hash1).toBe(hash2)
      expect(mockCrypto.createHash).toHaveBeenCalledWith('sha256')
      expect(mockHash.update).toHaveBeenCalledWith(input)
    })

    it('should generate different hashes for different inputs', async () => {
      const mockHash = {
        update: jest.fn().mockReturnThis(),
        digest: jest.fn()
          .mockReturnValueOnce('hash-for-input1')
          .mockReturnValueOnce('hash-for-input2'),
      }
      mockCrypto.createHash.mockReturnValue(mockHash)

      const hash1 = await vaultManager.generateHash('input1')
      const hash2 = await vaultManager.generateHash('input2')

      expect(hash1).not.toBe(hash2)
    })

    it('should handle hash generation errors', async () => {
      const error = new Error('Hash generation failed')
      mockCrypto.createHash.mockImplementation(() => {
        throw error
      })

      await expect(
        vaultManager.generateHash('test')
      ).rejects.toThrow('Hash generation failed')
    })
  })

  describe('Key Derivation', () => {
    it('should derive keys from password and salt', async () => {
      const mockDerivedKey = Buffer.from('derived-key-value')
      mockCrypto.pbkdf2Sync.mockReturnValue(mockDerivedKey)

      const password = 'user-password'
      const salt = 'random-salt'
      const result = await vaultManager.deriveKey(password, salt)

      expect(mockCrypto.pbkdf2Sync).toHaveBeenCalledWith(
        password,
        salt,
        100000,
        32,
        'sha512'
      )
      expect(result).toBe(mockDerivedKey.toString('base64'))
    })

    it('should use consistent parameters for key derivation', async () => {
      const mockDerivedKey = Buffer.from('consistent-key')
      mockCrypto.pbkdf2Sync.mockReturnValue(mockDerivedKey)

      const password = 'same-password'
      const salt = 'same-salt'
      
      const key1 = await vaultManager.deriveKey(password, salt)
      const key2 = await vaultManager.deriveKey(password, salt)

      expect(key1).toBe(key2)
      expect(mockCrypto.pbkdf2Sync).toHaveBeenCalledTimes(2)
    })

    it('should handle key derivation errors', async () => {
      const error = new Error('Key derivation failed')
      mockCrypto.pbkdf2Sync.mockImplementation(() => {
        throw error
      })

      await expect(
        vaultManager.deriveKey('password', 'salt')
      ).rejects.toThrow('Key derivation failed')
    })
  })

  describe('Security Validation', () => {
    it('should validate key strength', () => {
      const weakKey = '123'
      const strongKey = 'very-strong-encryption-key-with-good-entropy'

      expect(() => vaultManager.validateKeyStrength(weakKey)).toThrow(
        'Encryption key too weak'
      )
      expect(() => vaultManager.validateKeyStrength(strongKey)).not.toThrow()
    })

    it('should detect potential security issues', () => {
      const suspiciousData = 'password=admin123'
      const normalData = 'regular user data'

      expect(vaultManager.containsSensitiveData(suspiciousData)).toBe(true)
      expect(vaultManager.containsSensitiveData(normalData)).toBe(false)
    })
  })

  describe('Performance and Memory', () => {
    it('should handle large data encryption efficiently', async () => {
      const largeData = 'x'.repeat(1000000) // 1MB of data
      const key = 'test-encryption-key'
      
      const mockCipher = {
        update: jest.fn().mockReturnValue('encrypted-chunk'),
        final: jest.fn().mockReturnValue('-final'),
      }
      mockCrypto.createCipher.mockReturnValue(mockCipher)

      const startTime = process.hrtime.bigint()
      await vaultManager.encrypt(largeData, key)
      const endTime = process.hrtime.bigint()

      const executionTime = Number(endTime - startTime) / 1_000_000 // Convert to ms
      expect(executionTime).toBeLessThan(1000) // Should complete within 1 second
    })

    it('should properly clean up sensitive data from memory', async () => {
      const sensitiveData = 'very-sensitive-information'
      const key = 'cleanup-test-key'
      
      const mockCipher = {
        update: jest.fn().mockReturnValue('encrypted'),
        final: jest.fn().mockReturnValue('-data'),
      }
      mockCrypto.createCipher.mockReturnValue(mockCipher)

      await vaultManager.encrypt(sensitiveData, key)

      // Verify that internal buffers are cleared
      expect(vaultManager.hasPendingSensitiveData()).toBe(false)
    })
  })
})