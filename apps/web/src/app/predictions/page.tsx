"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { celoAlfajores } from "wagmi/chains"
import { Wallet, Connect, Avatar, Name } from "@composer-kit/ui/wallet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Calendar, Clock } from "lucide-react"

function PredictionsContent() {
  const { address, isConnected, chain } = useAccount()
  const isWrongNetwork = isConnected && chain?.id !== celoAlfajores.id

  // Mock predictions data
  const predictions: Array<{
    id: number
    homeTeam: string
    awayTeam: string
    league: string
    date: string
    predictedTeam: string
    amount: string
    status: string
  }> = []

  if (!isConnected) {
    return (
      <div className="container px-4 mx-auto max-w-6xl py-12">
        <Card>
          <CardHeader>
            <CardTitle>My Predictions</CardTitle>
            <CardDescription>Connect your wallet to view your predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <Wallet>
              <Connect label="Connect Wallet">
                <div className="flex items-center gap-2">
                  <Avatar />
                  <Name isTruncated />
                </div>
              </Connect>
            </Wallet>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container px-4 mx-auto max-w-6xl py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">My Predictions</h1>
        <p className="text-muted-foreground">View and track your sports predictions</p>
      </div>

      {isWrongNetwork ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Please switch to Celo Alfajores testnet
            </p>
          </CardContent>
        </Card>
      ) : predictions.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No predictions yet</h3>
            <p className="text-muted-foreground mb-4">
              Start making predictions on upcoming games to see them here
            </p>
            <a href="/">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                Browse Games
              </button>
            </a>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictions.map((prediction) => (
            <Card key={prediction.id}>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{prediction.league}</Badge>
                  <Badge variant={prediction.status === "won" ? "default" : "outline"}>
                    {prediction.status}
                  </Badge>
                </div>
                <CardTitle>{prediction.homeTeam} vs {prediction.awayTeam}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Calendar className="h-3 w-3" />
                  {prediction.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Your Prediction: </span>
                    <span className="font-semibold">{prediction.predictedTeam}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Stake: </span>
                    <span className="font-semibold">{prediction.amount} cUSD</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default function PredictionsPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="container px-4 mx-auto max-w-6xl py-12">Loading...</div>

  return <PredictionsContent />
}

