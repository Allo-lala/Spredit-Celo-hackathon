"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { celoAlfajores } from "wagmi/chains"
import { formatUnits, parseUnits } from "viem"
import { Wallet, Connect, Avatar, Name } from "@composer-kit/ui/wallet"
import { Address } from "@composer-kit/ui/address"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, XCircle, Coins } from "lucide-react"

// Contract ABI - Update this with your deployed contract address
const CLAIMABLE_TOKEN_ABI = [
  {
    inputs: [],
    name: "claimTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_address", type: "address" }],
    name: "checkClaimStatus",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "CLAIM_AMOUNT",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const

// TODO: Replace with your deployed contract address after deployment
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000"

// Check if contract address is valid (not the zero address)
const isValidContractAddress = CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000" && CONTRACT_ADDRESS.startsWith("0x") && CONTRACT_ADDRESS.length === 42

function HomeContent() {
  const { address, isConnected, chain } = useAccount()
  const [hasClaimed, setHasClaimed] = useState<boolean | null>(null)

  // Check if user has already claimed
  const { data: claimStatus, refetch: refetchClaimStatus } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CLAIMABLE_TOKEN_ABI,
    functionName: "checkClaimStatus",
    args: address ? [address] : undefined,
    chainId: celoAlfajores.id,
    query: {
      enabled: !!address && isConnected && isValidContractAddress,
    },
  })

  // Get token balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CLAIMABLE_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: celoAlfajores.id,
    query: {
      enabled: !!address && isConnected && isValidContractAddress,
    },
  })

  // Get claim amount
  const { data: claimAmount } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CLAIMABLE_TOKEN_ABI,
    functionName: "CLAIM_AMOUNT",
    chainId: celoAlfajores.id,
    query: {
      enabled: isValidContractAddress,
    },
  })

  // Write contract for claiming
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
    chainId: celoAlfajores.id,
  })

  useEffect(() => {
    if (claimStatus !== undefined) {
      setHasClaimed(claimStatus as boolean)
    }
  }, [claimStatus])

  useEffect(() => {
    if (isConfirmed) {
      refetchBalance()
      refetchClaimStatus()
      setHasClaimed(true)
    }
  }, [isConfirmed, refetchBalance, refetchClaimStatus])

  const handleClaim = () => {
    if (!address || !isConnected) return

    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CLAIMABLE_TOKEN_ABI,
      functionName: "claimTokens",
      chainId: celoAlfajores.id,
    })
  }

  const isWrongNetwork = isConnected && chain?.id !== celoAlfajores.id
  const canClaim = isConnected && !hasClaimed && !isWrongNetwork && !isPending && !isConfirming && isValidContractAddress
  const displayBalance = balance ? formatUnits(balance as bigint, 18) : "0"
  const displayClaimAmount = claimAmount ? formatUnits(claimAmount as bigint, 18) : "20"

  return (
    <main className="flex-1">
      <section className="relative py-8 lg:py-16">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Claim Your <span className="text-primary">Tokens</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Connect your wallet and claim 20 tokens. One-time only per wallet address.
            </p>
          </div>

          {/* Contract Not Deployed Warning */}
          {!isValidContractAddress && (
            <div className="mb-6 max-w-md mx-auto">
              <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                        Contract Not Deployed
                      </h3>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                        The token contract needs to be deployed before you can claim tokens.
                      </p>
                      <div className="text-xs text-yellow-600 dark:text-yellow-400 space-y-1">
                        <p>1. Deploy the contract: <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">cd apps/contracts && pnpm deploy:token:alfajores</code></p>
                        <p>2. Update .env with: <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=0x...</code></p>
                        <p>3. Restart the dev server</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex flex-col items-center gap-6">
            {/* Wallet Connection Card */}
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  Wallet Connection
                </CardTitle>
                <CardDescription>
                  Connect your wallet to claim tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="w-full">
                  <Wallet>
                    <Connect
                      label="Connect Wallet"
                      onConnect={() => {
                        console.log("Wallet connected")
                      }}
                    >
                      <div className="flex items-center gap-3 w-full justify-center">
                        <Avatar />
                        <Name isTruncated />
                      </div>
                    </Connect>
                  </Wallet>
                </div>

                {isConnected && address && (
                  <div className="w-full pt-4 border-t">
                    <div className="text-sm text-muted-foreground mb-2">Your Address:</div>
                    <Address
                      address={address}
                      isTruncated
                      copyOnClick
                      className="text-sm font-mono"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Claim Card */}
            {isConnected && isValidContractAddress && (
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Claim Tokens</CardTitle>
                  <CardDescription>
                    Claim {displayClaimAmount} tokens to your wallet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isWrongNetwork && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
                      <XCircle className="h-4 w-4" />
                      <span className="text-sm">
                        Please switch to Celo Alfajores testnet
                      </span>
                    </div>
                  )}

                  {!isWrongNetwork && hasClaimed && (
                    <div className="flex items-center gap-2 p-3 bg-green-500/10 text-green-600 dark:text-green-400 rounded-md">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm">
                        You have already claimed your tokens!
                      </span>
                    </div>
                  )}

                  {!isWrongNetwork && !hasClaimed && (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Claim Amount</div>
                        <div className="text-2xl font-bold">{displayClaimAmount} CLAIM</div>
                      </div>

                      <Button
                        onClick={handleClaim}
                        disabled={!canClaim || isPending || isConfirming}
                        className="w-full"
                        size="lg"
                      >
                        {isPending || isConfirming ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {isPending ? "Confirming..." : "Processing..."}
                          </>
                        ) : (
                          "Claim Tokens"
                        )}
                      </Button>

                      {error && (
                        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                          {error.message}
                        </div>
                      )}

                      {isConfirmed && (
                        <div className="flex items-center gap-2 p-3 bg-green-500/10 text-green-600 dark:text-green-400 rounded-md">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-sm">Tokens claimed successfully!</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Balance Display */}
                  <div className="pt-4 border-t">
                    <div className="text-sm text-muted-foreground mb-2">Your Balance</div>
                    <div className="text-2xl font-bold">{displayBalance} CLAIM</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions Card */}
            {!isConnected && (
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>How to Claim</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Connect your wallet using the button above</li>
                    <li>Make sure you're on Celo Alfajores testnet</li>
                    <li>Click the "Claim Tokens" button</li>
                    <li>Confirm the transaction in your wallet</li>
                    <li>Wait for the transaction to complete</li>
                  </ol>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <main className="flex-1">
        <section className="relative py-8 lg:py-16">
          <div className="container px-4 mx-auto max-w-4xl">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                Claim Your <span className="text-primary">Tokens</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Connect your wallet and claim 20 tokens. One-time only per wallet address.
              </p>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return <HomeContent />
}
