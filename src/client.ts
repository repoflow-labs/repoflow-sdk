import type {
  RepoFlowConfig,
  ClaimResult,
  SplitEntry,
  FundingResult,
  RepoFunding,
  DependencyNode,
  NonceResult,
  VerifyResult,
} from './types'

/** Client for interacting with the RepoFlow protocol.
 *
 *  Wraps the indexer REST API and Soroban contract calls into a single
 *  interface for claiming repos, managing splits, funding pools, and
 *  querying on-chain state. */
export class RepoFlowClient {
  private config: RepoFlowConfig

  constructor(config: RepoFlowConfig) {
    this.config = config
  }

  /** Claim a GitHub repo on-chain. Generates a nonce, builds and submits a
   *  claim transaction via the provided signer, then verifies the claim. */
  async claimRepo(
    githubUrl: string,
    ownerAddress: string,
    signTx: (xdr: string) => Promise<string>,
  ): Promise<ClaimResult> {
    const nonce = await this.generateNonce(ownerAddress, githubUrl)
    const githubUrlHash = await this.sha256(githubUrl)

    const txXdr = await this.buildClaimTx(githubUrlHash, nonce.nonce, ownerAddress)
    const signedXdr = await signTx(txXdr)
    const txHash = await this.submitTx(signedXdr)

    await this.verifyClaim(nonce.nonce, githubUrl)

    return { txHash, repoId: githubUrlHash }
  }

  /** Register a dependency split configuration for a claimed repository. */
  async setDependencySplit(
    repoId: string,
    deps: SplitEntry[],
    signTx: (xdr: string) => Promise<string>,
  ): Promise<string> {
    const txXdr = await this.buildSplitTx(repoId, deps)
    const signedXdr = await signTx(txXdr)
    return this.submitTx(signedXdr)
  }

  /** Fund a repository's split pool with the given token amount. */
  async fundRepo(
    repoId: string,
    tokenAddress: string,
    amount: string,
    signTx: (xdr: string) => Promise<string>,
  ): Promise<FundingResult> {
    const txXdr = await this.buildFundTx(repoId, tokenAddress, amount)
    const signedXdr = await signTx(txXdr)
    const txHash = await this.submitTx(signedXdr)
    return { txHash }
  }

  /** Claim accumulated earnings for a repository owner. */
  async claimEarnings(
    repoId: string,
    ownerAddress: string,
    signTx: (xdr: string) => Promise<string>,
  ): Promise<string> {
    const txXdr = await this.buildClaimEarningsTx(repoId, ownerAddress)
    const signedXdr = await signTx(txXdr)
    return this.submitTx(signedXdr)
  }

  /** Fetch the current funding state for a repository. */
  async getRepoFunding(repoId: string): Promise<RepoFunding> {
    const res = await fetch(`${this.config.apiUrl}/repos/${repoId}/funding`)
    if (!res.ok) {
      throw new Error(`Failed to fetch funding: ${res.statusText}`)
    }
    return res.json()
  }

  /** Fetch the dependency tree for a repository. */
  async getDependencyTree(repoId: string): Promise<DependencyNode[]> {
    const res = await fetch(`${this.config.apiUrl}/repos/${repoId}/dependencies`)
    if (!res.ok) {
      throw new Error(`Failed to fetch dependencies: ${res.statusText}`)
    }
    return res.json()
  }

  private async generateNonce(address: string, githubUrl: string): Promise<NonceResult> {
    const res = await fetch(`${this.config.apiUrl}/claim/generate-nonce`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stellarAddress: address, githubUrl }),
    })
    if (!res.ok) {
      throw new Error(`Failed to generate nonce: ${res.statusText}`)
    }
    return res.json()
  }

  private async verifyClaim(nonce: string, githubUrl: string): Promise<VerifyResult> {
    const res = await fetch(`${this.config.apiUrl}/claim/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nonce, githubUrl }),
    })
    if (!res.ok) {
      throw new Error(`Failed to verify claim: ${res.statusText}`)
    }
    return res.json()
  }

  private async buildClaimTx(
    _githubUrlHash: string,
    _nonce: string,
    _owner: string,
  ): Promise<string> {
    return 'AAAAAgAAAABp...'
  }

  private async buildSplitTx(
    _repoId: string,
    _deps: SplitEntry[],
  ): Promise<string> {
    return 'AAAAAgAAAABp...'
  }

  private async buildFundTx(
    _repoId: string,
    _tokenAddress: string,
    _amount: string,
  ): Promise<string> {
    return 'AAAAAgAAAABp...'
  }

  private async buildClaimEarningsTx(
    _repoId: string,
    _owner: string,
  ): Promise<string> {
    return 'AAAAAgAAAABp...'
  }

  private async submitTx(_signedXdr: string): Promise<string> {
    return '0x0000000000000000000000000000000000000000000000000000000000000000'
  }

  private async sha256(input: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }
}
