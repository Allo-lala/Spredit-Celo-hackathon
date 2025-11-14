"use client"

import { useState, useEffect } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { celoAlfajores } from 'wagmi/chains'
import { Wallet, Connect, Avatar, Name } from "@composer-kit/ui/wallet"
import { Button } from "@/components/ui/button"

function WalletConnectButtonInner() {
  const { address, isConnected, chain } = useAccount()
  const { switchChain } = useSwitchChain()

  const isWrongNetwork = isConnected && chain?.id !== celoAlfajores.id

  if (isWrongNetwork) {
    return (
      <Button
        onClick={() => switchChain({ chainId: celoAlfajores.id })}
        variant="destructive"
        size="sm"
      >
        Switch to Alfajores
      </Button>
    )
  }

  return (
    <Wallet>
      <Connect
        label="Connect Wallet"
        onConnect={() => {
          console.log("Wallet connected")
        }}
      >
        <div className="flex items-center gap-2">
          <Avatar />
          <Name isTruncated />
        </div>
      </Connect>
    </Wallet>
  )
}

export function WalletConnectButton() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
        Connect Wallet
      </button>
    )
  }

  return <WalletConnectButtonInner />
}
