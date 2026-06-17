export interface RepoFlowConfig {
  contractId: string
  rpcUrl: string
  networkPassphrase: string
  apiUrl: string
}

export interface RepoClaim {
  repoId: string
  githubUrl: string
  ownerAddress: string
  claimedAt: string
  txHash: string
}

export interface ClaimResult {
  txHash: string
  repoId: string
}

export interface SplitEntry {
  depRepoId: string
  weightBps: number
}

export interface DependencyNode {
  repoId: string
  githubUrl: string
  ownerAddress: string
  weightBps: number
  depth: number
  children: DependencyNode[]
}

export interface RepoFunding {
  repoId: string
  tokenAddress: string
  totalDeposited: string
  totalWithdrawn: string
  claimable: string
}

export interface FundingResult {
  txHash: string
}

export interface NonceResult {
  nonce: string
  expiresAt: string
}

export interface VerifyResult {
  verified: boolean
}
