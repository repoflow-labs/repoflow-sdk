import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RepoFlowClient } from '../client'
import type { RepoFlowConfig } from '../types'

const config: RepoFlowConfig = {
  contractId: 'CBAK7SEF7V6CHIZL4GJLJYEL44N3SIUMJXFFE7IGPLAXAR5MTLWFANRW',
  rpcUrl: 'https://rpc.futurenet.stellar.org',
  networkPassphrase: 'Test SDF Future Network ; October 2022',
  apiUrl: 'http://localhost:3000',
}

function mockClient() {
  globalThis.fetch = vi.fn()
}

describe('RepoFlowClient', () => {
  beforeEach(() => {
    mockClient()
  })

  it('creates a client with config', () => {
    const client = new RepoFlowClient(config)
    expect(client).toBeInstanceOf(RepoFlowClient)
  })

  it('getRepoFunding fetches from API', async () => {
    const mockData = {
      repoId: 'abc123',
      tokenAddress: 'G...',
      totalDeposited: '1000',
      totalWithdrawn: '200',
      claimable: '800',
    }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response)

    const client = new RepoFlowClient(config)
    const result = await client.getRepoFunding('abc123')

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/repos/abc123/funding')
    expect(result.repoId).toBe('abc123')
    expect(result.claimable).toBe('800')
  })

  it('getDependencyTree fetches from API', async () => {
    const mockTree = [
      {
        repoId: 'abc',
        githubUrl: 'https://github.com/org/repo',
        ownerAddress: 'G...',
        weightBps: 6000,
        depth: 0,
        children: [
          {
            repoId: 'def',
            githubUrl: 'https://github.com/org/dep',
            ownerAddress: 'G...',
            weightBps: 4000,
            depth: 1,
            children: [],
          },
        ],
      },
    ]
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTree),
    } as Response)

    const client = new RepoFlowClient(config)
    const result = await client.getDependencyTree('abc')

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/repos/abc/dependencies')
    expect(result).toHaveLength(1)
    expect(result[0].children).toHaveLength(1)
  })

  it('throws on API error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    } as Response)

    const client = new RepoFlowClient(config)
    await expect(client.getRepoFunding('nonexistent')).rejects.toThrow(
      'Failed to fetch funding: Not Found',
    )
  })

  it('claimRepo generates nonce, builds tx, submits, and verifies', async () => {
    const signTx = vi.fn().mockResolvedValue('signed-xdr')
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ nonce: 'nonce-123', expiresAt: '2026-07-01T00:00:00Z' }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ verified: true }),
      } as Response)

    const client = new RepoFlowClient(config)
    const result = await client.claimRepo(
      'https://github.com/org/repo',
      'GABCDEF123',
      signTx,
    )

    expect(result.txHash).toBeTruthy()
    expect(result.repoId).toBeTruthy()
    expect(signTx).toHaveBeenCalledOnce()
  })

  it('fundRepo submits tx and returns hash', async () => {
    const signTx = vi.fn().mockResolvedValue('signed-xdr')

    const client = new RepoFlowClient(config)
    const result = await client.fundRepo('repo-1', 'GTOKEN', '500', signTx)

    expect(result.txHash).toBeTruthy()
    expect(signTx).toHaveBeenCalledOnce()
  })

  it('exports SDK_VERSION', async () => {
    const { SDK_VERSION } = await import('../index')
    expect(SDK_VERSION).toBe('0.1.0')
  })
})
